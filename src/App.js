import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const disciplinas = [
    'Inglês', 'Ciências', 'História', 'Matemática', 
    'Geografia', 'Português', 'Artes'
  ];
  
  const notaInicial = {
    Pedro: disciplinas.reduce((acc, disciplina) => {
      acc[disciplina] = { 
        prova1: '', 
        prova2: '' 
      };
      return acc;
    }, {}),
    Julio: disciplinas.reduce((acc, disciplina) => {
      acc[disciplina] = { 
        prova1: '', 
        prova2: '' 
      };
      return acc;
    }, {})
  };
  
  const [notas, setNotas] = useState(notaInicial);
  const [saldos, setSaldos] = useState({
    Pedro: 0,
    Julio: 0
  });
  const [historicoRecompensas, setHistoricoRecompensas] = useState([]);
  
  // Função para atualizar a nota
  const atualizarNota = (filho, disciplina, prova, valor) => {
    const valorNumerico = valor === '' ? '' : parseFloat(valor);
    
    // Validação do valor da nota (0 a 5)
    if (valorNumerico !== '' && (isNaN(valorNumerico) || valorNumerico < 0 || valorNumerico > 5)) {
      alert('A nota deve estar entre 0 e 5!');
      return;
    }
    
    const novasNotas = JSON.parse(JSON.stringify(notas)); // Deep copy
    novasNotas[filho][disciplina][prova] = valorNumerico;
    setNotas(novasNotas);
  };
  
  // Calcular recompensa para um par de notas dos irmãos
  const calcularRecompensa = (notaPedro, notaJulio) => {
    if (notaPedro === '' || notaJulio === '') return null;
    
    // Converter para números
    const notaPedroValida = typeof notaPedro === 'string' ? parseFloat(notaPedro) : notaPedro;
    const notaJulioValida = typeof notaJulio === 'string' ? parseFloat(notaJulio) : notaJulio;
    
    // Validar valores
    if (isNaN(notaPedroValida) || isNaN(notaJulioValida)) return null;
    
    let recompensaPedro = 0;
    let recompensaJulio = 0;
    let descricao = '';
    
    // Regra 1: 2 tiraram 5
    if (notaPedroValida === 5 && notaJulioValida === 5) {
      recompensaPedro = 40;
      recompensaJulio = 40;
      descricao = 'Os dois tiraram nota 5!';
    }
    // Regra 2: 1 tirou 5 e o outro tirou >= 4,5
    else if ((notaPedroValida === 5 && notaJulioValida >= 4.5) || 
             (notaJulioValida === 5 && notaPedroValida >= 4.5)) {
      recompensaPedro = 25;
      recompensaJulio = 25;
      descricao = 'Um tirou 5 e o outro tirou 4,5 ou mais!';
    }
    // Regra 3: 1 tirou 5 e o outro tirou < 4,5
    else if ((notaPedroValida === 5 && notaJulioValida < 4.5) || 
             (notaJulioValida === 5 && notaPedroValida < 4.5)) {
      recompensaPedro = 15;
      recompensaJulio = 15;
      descricao = 'Um tirou 5 e o outro tirou menos que 4,5!';
    }
    // Regra 4: 2 tiraram >= 4,5
    else if (notaPedroValida >= 4.5 && notaJulioValida >= 4.5) {
      recompensaPedro = 20;
      recompensaJulio = 20;
      descricao = 'Os dois tiraram 4,5 ou mais!';
    }
    // Regra 5: 1 tirou >= 4,5
    else if (notaPedroValida >= 4.5 || notaJulioValida >= 4.5) {
      recompensaPedro = 10;
      recompensaJulio = 10;
      descricao = 'Um dos dois tirou 4,5 ou mais!';
    }
    // Caso nenhuma regra se aplique
    else {
      recompensaPedro = 0;
      recompensaJulio = 0;
      descricao = 'Nenhuma das metas foi atingida.';
    }
    
    return {
      recompensaPedro,
      recompensaJulio,
      descricao
    };
  };
  
  // Calcular saldo total
  useEffect(() => {
    console.log("Notas atualizadas:", notas); // Debug
    
    let totalPedro = 0;
    let totalJulio = 0;
    const historicoNovo = [];
    
    disciplinas.forEach(disciplina => {
      // Prova 1
      const notaPedroP1 = notas.Pedro[disciplina].prova1;
      const notaJulioP1 = notas.Julio[disciplina].prova1;
      
      const recompensaP1 = calcularRecompensa(notaPedroP1, notaJulioP1);
      
      if (recompensaP1) {
        totalPedro += recompensaP1.recompensaPedro;
        totalJulio += recompensaP1.recompensaJulio;
        
        historicoNovo.push({
          id: `${disciplina}-P1`,
          disciplina,
          prova: 'Prova 1',
          notaPedro: notaPedroP1,
          notaJulio: notaJulioP1,
          recompensa: recompensaP1
        });
      }
      
      // Prova 2
      const notaPedroP2 = notas.Pedro[disciplina].prova2;
      const notaJulioP2 = notas.Julio[disciplina].prova2;
      
      const recompensaP2 = calcularRecompensa(notaPedroP2, notaJulioP2);
      
      if (recompensaP2) {
        totalPedro += recompensaP2.recompensaPedro;
        totalJulio += recompensaP2.recompensaJulio;
        
        historicoNovo.push({
          id: `${disciplina}-P2`,
          disciplina,
          prova: 'Prova 2',
          notaPedro: notaPedroP2,
          notaJulio: notaJulioP2,
          recompensa: recompensaP2
        });
      }
    });
    
    console.log("Saldos calculados:", { Pedro: totalPedro, Julio: totalJulio }); // Debug
    
    setSaldos({
      Pedro: totalPedro,
      Julio: totalJulio
    });
    
    setHistoricoRecompensas(historicoNovo);
  }, [notas]);
  
  return (
    <div className="container">
      <h1 className="titulo">Sistema de Recompensas de Estudos</h1>
      
      {/* Saldo Total */}
      <div className="saldos">
        <div className="card-saldo-pedro">
          <h2>Saldo de Pedro</h2>
          <p className="valor-saldo">R$ {saldos.Pedro.toFixed(2)}</p>
        </div>
        <div className="card-saldo-julio">
          <h2>Saldo de Julio</h2>
          <p className="valor-saldo">R$ {saldos.Julio.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Tabela de notas */}
      <div className="tabela-container">
        <table className="tabela-notas">
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Prova</th>
              <th>Nota Pedro</th>
              <th>Nota Julio</th>
              <th>Recompensa</th>
            </tr>
          </thead>
          <tbody>
            {disciplinas.map((disciplina) => (
              <React.Fragment key={disciplina}>
                <tr>
                  <td rowSpan="2">{disciplina}</td>
                  <td>Prova 1</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      className="input-nota"
                      value={notas.Pedro[disciplina].prova1}
                      onChange={(e) => atualizarNota('Pedro', disciplina, 'prova1', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      className="input-nota"
                      value={notas.Julio[disciplina].prova1}
                      onChange={(e) => atualizarNota('Julio', disciplina, 'prova1', e.target.value)}
                    />
                  </td>
                  <td>
                    {historicoRecompensas.find(h => h.id === `${disciplina}-P1`)?.recompensa?.descricao || '-'}
                  </td>
                </tr>
                <tr>
                  <td>Prova 2</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      className="input-nota"
                      value={notas.Pedro[disciplina].prova2}
                      onChange={(e) => atualizarNota('Pedro', disciplina, 'prova2', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      className="input-nota"
                      value={notas.Julio[disciplina].prova2}
                      onChange={(e) => atualizarNota('Julio', disciplina, 'prova2', e.target.value)}
                    />
                  </td>
                  <td>
                    {historicoRecompensas.find(h => h.id === `${disciplina}-P2`)?.recompensa?.descricao || '-'}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Histórico de recompensas */}
      <div className="historico">
        <h2>Histórico de Recompensas</h2>
        <table className="tabela-historico">
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Prova</th>
              <th>Pedro</th>
              <th>Julio</th>
              <th>Descrição</th>
              <th>Recompensa (cada)</th>
            </tr>
          </thead>
          <tbody>
            {historicoRecompensas
              .filter(item => item.recompensa.recompensaPedro > 0 || item.recompensa.recompensaJulio > 0)
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.disciplina}</td>
                  <td>{item.prova}</td>
                  <td>{item.notaPedro}</td>
                  <td>{item.notaJulio}</td>
                  <td>{item.recompensa.descricao}</td>
                  <td className="valor-recompensa">
                    R$ {item.recompensa.recompensaPedro.toFixed(2)}
                  </td>
                </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total">
              <td colSpan="5" align="right">Total Pedro:</td>
              <td className="valor-recompensa">R$ {saldos.Pedro.toFixed(2)}</td>
            </tr>
            <tr className="total">
              <td colSpan="5" align="right">Total Julio:</td>
              <td className="valor-recompensa">R$ {saldos.Julio.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* Regras */}
      <div className="regras">
        <h2>Regras de Recompensas:</h2>
        <ul>
          <li>1 irmão tirou maior ou igual a 4,5: os dois irmãos ganham R$ 10,00 cada.</li>
          <li>2 irmãos tiraram maior ou igual a 4,5: os dois ganham R$ 20,00 cada.</li>
          <li>1 irmão tirou 5 e o outro tirou menos de 4,5: os dois ganham R$ 15,00 cada.</li>
          <li>1 irmão tirou 5 e o outro tirou maior ou igual a 4,5: os dois ganham R$ 25,00 cada.</li>
          <li>2 irmãos tiraram 5: os dois ganham R$ 40,00 cada.</li>
        </ul>
      </div>
    </div>
  );
}

export default App;