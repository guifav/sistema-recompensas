import React, { useState, useEffect } from 'react';

const SistemaRecompensas = () => {
  const disciplinas = [
    'Inglês', 'Ciências', 'História', 'Matemática', 
    'Geografia', 'Português', 'Artes'
  ];
  
  const semestreAtual = 1;
  
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
    
    const novasNotas = {...notas};
    novasNotas[filho][disciplina][prova] = valorNumerico;
    setNotas(novasNotas);
  };
  
  // Calcular recompensa para um par de notas dos irmãos
  const calcularRecompensa = (notaPedro, notaJulio) => {
    if (notaPedro === '' || notaJulio === '') return null;
    
    const notaPedroValida = parseFloat(notaPedro);
    const notaJulioValida = parseFloat(notaJulio);
    
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
    
    setSaldos({
      Pedro: totalPedro,
      Julio: totalJulio
    });
    
    setHistoricoRecompensas(historicoNovo);
  }, [notas]);
  
  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded shadow">
      <h1 className="text-3xl font-bold text-center mb-6">Sistema de Recompensas de Estudos</h1>
      
      {/* Saldo Total */}
      <div className="flex justify-around mb-8">
        <div className="bg-blue-100 p-4 rounded shadow text-center w-2/5">
          <h2 className="text-xl font-semibold">Saldo de Pedro</h2>
          <p className="text-3xl font-bold text-green-600">R$ {saldos.Pedro.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center w-2/5">
          <h2 className="text-xl font-semibold">Saldo de Julio</h2>
          <p className="text-3xl font-bold text-green-600">R$ {saldos.Julio.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Tabela de notas */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Disciplina</th>
              <th className="py-2 px-4 border">Prova</th>
              <th className="py-2 px-4 border">Nota Pedro</th>
              <th className="py-2 px-4 border">Nota Julio</th>
              <th className="py-2 px-4 border">Recompensa</th>
            </tr>
          </thead>
          <tbody>
            {disciplinas.map((disciplina) => (
              <>
                <tr key={`${disciplina}-P1`}>
                  <td className="py-2 px-4 border" rowSpan="2">{disciplina}</td>
                  <td className="py-2 px-4 border">Prova 1</td>
                  <td className="py-2 px-4 border">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-20 p-1 border rounded"
                      value={notas.Pedro[disciplina].prova1}
                      onChange={(e) => atualizarNota('Pedro', disciplina, 'prova1', e.target.value)}
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-20 p-1 border rounded"
                      value={notas.Julio[disciplina].prova1}
                      onChange={(e) => atualizarNota('Julio', disciplina, 'prova1', e.target.value)}
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    {historicoRecompensas.find(h => h.id === `${disciplina}-P1`)?.recompensa?.descricao || '-'}
                  </td>
                </tr>
                <tr key={`${disciplina}-P2`}>
                  <td className="py-2 px-4 border">Prova 2</td>
                  <td className="py-2 px-4 border">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-20 p-1 border rounded"
                      value={notas.Pedro[disciplina].prova2}
                      onChange={(e) => atualizarNota('Pedro', disciplina, 'prova2', e.target.value)}
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-20 p-1 border rounded"
                      value={notas.Julio[disciplina].prova2}
                      onChange={(e) => atualizarNota('Julio', disciplina, 'prova2', e.target.value)}
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    {historicoRecompensas.find(h => h.id === `${disciplina}-P2`)?.recompensa?.descricao || '-'}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Histórico de recompensas */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Histórico de Recompensas</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Disciplina</th>
              <th className="py-2 px-4 border">Prova</th>
              <th className="py-2 px-4 border">Pedro</th>
              <th className="py-2 px-4 border">Julio</th>
              <th className="py-2 px-4 border">Descrição</th>
              <th className="py-2 px-4 border">Recompensa (cada)</th>
            </tr>
          </thead>
          <tbody>
            {historicoRecompensas
              .filter(item => item.recompensa.recompensaPedro > 0 || item.recompensa.recompensaJulio > 0)
              .map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-4 border">{item.disciplina}</td>
                  <td className="py-2 px-4 border">{item.prova}</td>
                  <td className="py-2 px-4 border">{item.notaPedro}</td>
                  <td className="py-2 px-4 border">{item.notaJulio}</td>
                  <td className="py-2 px-4 border">{item.recompensa.descricao}</td>
                  <td className="py-2 px-4 border text-right">
                    R$ {item.recompensa.recompensaPedro.toFixed(2)}
                  </td>
                </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-200 font-bold">
              <td className="py-2 px-4 border" colSpan="5" align="right">Total Pedro:</td>
              <td className="py-2 px-4 border text-right">R$ {saldos.Pedro.toFixed(2)}</td>
            </tr>
            <tr className="bg-gray-200 font-bold">
              <td className="py-2 px-4 border" colSpan="5" align="right">Total Julio:</td>
              <td className="py-2 px-4 border text-right">R$ {saldos.Julio.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* Regras */}
      <div className="mt-8 p-4 bg-gray-50 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Regras de Recompensas:</h2>
        <ul className="list-disc pl-6">
          <li className="mb-1">1 irmão tirou maior ou igual a 4,5: os dois irmãos ganham R$ 10,00 cada.</li>
          <li className="mb-1">2 irmãos tiraram maior ou igual a 4,5: os dois ganham R$ 20,00 cada.</li>
          <li className="mb-1">1 irmão tirou 5 e o outro tirou menos de 4,5: os dois ganham R$ 15,00 cada.</li>
          <li className="mb-1">1 irmão tirou 5 e o outro tirou maior ou igual a 4,5: os dois ganham R$ 25,00 cada.</li>
          <li className="mb-1">2 irmãos tiraram 5: os dois ganham R$ 40,00 cada.</li>
        </ul>
      </div>
    </div>
  );
};

export default SistemaRecompensas;