let text = document.getElementById('lugar');
let resultado = document.getElementById('res');
let dateInput = document.getElementById('date');
let timeInput = document.getElementById('time');
let manutInput = document.getElementById('manut');
let pecasInput = document.getElementById('pecastxt');
let intInput = document.getElementById('int');
let nameInput = document.getElementById('name');
let datefinal = document.getElementById('date-final');
let timefinal = document.getElementById('time-final');
let setorInput = document.getElementById('sector');

// Recupera os registros armazenados no localStorage
let manutencaoRegistros = JSON.parse(localStorage.getItem('manutencao')) || [];

// Função para agrupar as manutenções por data
function agruparManutencaoPorData() {
    let manutencaoPorData = {};

    manutencaoRegistros.forEach(registro => {
        if (!manutencaoPorData[registro.data]) {
            manutencaoPorData[registro.data] = [];
        }
        manutencaoPorData[registro.data].push(registro);
    });

    return manutencaoPorData;
}

// Função para renderizar os registros de manutenção
function renderizarManutencao(dataSelecionada = null) {
    resultado.innerHTML = '';

    const manutencaoAgrupada = agruparManutencaoPorData();

    if (dataSelecionada) {
        if (manutencaoAgrupada[dataSelecionada]) {
            manutencaoAgrupada[dataSelecionada].forEach(registro => {
                criarManutencaoElement(registro);
            });
        }
    } else {
        Object.keys(manutencaoAgrupada).forEach(data => {
            let dataDiv = document.createElement('div');
            dataDiv.classList.add('data-manutencao');
            dataDiv.textContent = `Data: ${data}`;
            resultado.appendChild(dataDiv);

            manutencaoAgrupada[data].forEach(registro => {
                criarManutencaoElement(registro);
            });
        });
    }
}

// Função para criar o elemento de cada manutenção
function criarManutencaoElement(registro) {
    let manutencaoDiv = document.createElement('div');
    manutencaoDiv.classList.add('manutencao');

    let manutencaoTexto = document.createElement('span');
    manutencaoTexto.classList.add('manutencao-texto');
    manutencaoTexto.textContent = ` Setor:${registro.setor} | Nome: ${registro.nome} | Equipamento: ${registro.equipamento} | Manutenção: ${registro.tipoManutencao} | Peças: ${registro.pecas} | Tipo: ${registro.tipoInt}`;

    let manutencaoHora = document.createElement('span');
    manutencaoHora.classList.add('manutencao-hora');
    manutencaoHora.textContent = ` | Hora: ${registro.hora}`;

    // Botão de remover simples
    let botaoRemover = document.createElement('button');
    botaoRemover.classList.add('btn', 'btn-danger', 'btn-sm', 'btn-remover');
    botaoRemover.textContent = 'Remover';
    botaoRemover.onclick = () => removerManutencao(registro.id);

    manutencaoDiv.appendChild(manutencaoTexto);
    manutencaoDiv.appendChild(manutencaoHora);
    manutencaoDiv.appendChild(botaoRemover);

    resultado.appendChild(manutencaoDiv);
}

// Função para adicionar um novo registro
function registrar() {
    const dateend = datefinal.value;
    const horaend = timefinal.value;
    const dataSelecionada = dateInput.value;
    const horaSelecionada = timeInput.value;
    const tipoManutencao = manutInput.value;
    const tipoInt = intInput.value;
    const pecas = pecasInput.value;
    const nome = nameInput.value;  // Recupera o valor de nameInput
    const equipamento = text.value;
    const setor = setorInput.value;

    if (!dataSelecionada || !horaSelecionada || !tipoManutencao || !pecas || !equipamento || !tipoInt || !nome || !dateend || !horaend) {  // Adiciona verificação para nameInput
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const manutencaoId = Date.now();
    manutencaoRegistros.push({
        id: manutencaoId,
        equipamento: equipamento,
        tipoManutencao: tipoManutencao,
        tipoInt: tipoInt,
        hora: horaSelecionada,
        pecas: pecas,
        nome: nome,  // Adiciona o campo nome no registro
        data: dataSelecionada,
        horaend: horaend,
        dateend: dateend,
        setor: setor
    });

    localStorage.setItem('manutencao', JSON.stringify(manutencaoRegistros));

    renderizarManutencao(dataSelecionada); // Atualiza a lista de registros
    text.value = '';
    timeInput.value = '';
    pecasInput.value = '';
    nameInput.value = '';  // Limpa o campo nameInput após o registro
    datefinal.value = '';
    timefinal.value = '';
    setorInput.value = '';
}

// Função para remover um registro de manutenção
function removerManutencao(manutencaoId) {
    manutencaoRegistros = manutencaoRegistros.filter(m => m.id !== manutencaoId);
    localStorage.setItem('manutencao', JSON.stringify(manutencaoRegistros));
    renderizarManutencao();
}

// Função para obter a data atual
function obterDataAtual() {
    let data = new Date();
    let ano = data.getFullYear();
    let mes = String(data.getMonth() + 1).padStart(2, '0');
    let dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

// Evento de mudança da data selecionada
dateInput.addEventListener('change', () => {
    const dataSelecionada = dateInput.value;
    renderizarManutencao(dataSelecionada);
});

// Renderizar as manutenções ao carregar a página
let dataAtual = obterDataAtual();
dateInput.value = dataAtual;
renderizarManutencao(dataAtual);

function relatorio() {
    let container = document.createElement("div");
    container.style.maxWidth = "100%"; // Evita que a tela fique desajustada no mobile
    container.innerHTML = `
        <label for='dataInicio' class="form-label">Data de Início:</label>
        <input type='date' id='dataInicio' class='form-control mb-2' style="font-size: 16px;">
        <label for='dataFim' class="form-label">Data Final:</label>
        <input type='date' id='dataFim' class='form-control mb-2' style="font-size: 16px;">
        <button id='gerarRelatorio' class='btn btn-primary mt-2' style="width: 100%; font-size: 16px;">Gerar Relatório</button>
    `;

    resultado.innerHTML = '';
    resultado.appendChild(container);

    document.getElementById("gerarRelatorio").addEventListener("click", () => {
        let dataInicio = document.getElementById("dataInicio").value;
        let dataFim = document.getElementById("dataFim").value;

        if (!dataInicio || !dataFim) {
            alert("Você deve informar ambas as datas!");
            return;
        }

        let dataInicioObj = new Date(dataInicio);
        let dataFimObj = new Date(dataFim);

        if (dataInicioObj > dataFimObj) {
            alert("A data de início não pode ser maior que a data de fim!");
            return;
        }

        resultado.innerHTML = '';

        let registrosFiltrados = manutencaoRegistros
            .filter(registro => {
                let dataRegistro = new Date(registro.data);
                return dataRegistro >= dataInicioObj && dataRegistro <= dataFimObj;
            })
            .sort((a, b) => new Date(a.data) - new Date(b.data)); // Ordena por data

        if (registrosFiltrados.length === 0) {
            resultado.innerHTML = '<p style="font-size: 16px; text-align: center;">Nenhuma manutenção encontrada no período selecionado.</p>';
            return;
        }

        let relatorioTexto = "Relatório de Manutenções\n\n";
        let dadosExcel = [["Setor","Nome", "Data de inicio","Data final","Hora de inicio","Hora de término","Equipamento", "Manutenção", "Tipo", "Observação"]]; // Cabeçalhos para o Excel (adicionando "Nome")

        registrosFiltrados.forEach(registro => {  
            let dataFormatada = new Date(registro.data).toLocaleDateString('pt-BR'); //  a data para DD/MM/AAAA
            let datafinalFormatada = new Date(registro.dateend).toLocaleDateString('pt-BR');
            relatorioTexto += `Setor: ${registro.setor}\n`;
            relatorioTexto += `Nome: ${registro.nome}\n`;// Adiciona "Nome" no relatório
            relatorioTexto += `Data de inicio: ${dataFormatada}\n`;
            relatorioTexto += `Data final: ${datafinalFormatada}\n`;
            relatorioTexto += `Hora de inicio: ${registro.hora}\n`;
            relatorioTexto += `Hora de térmio: ${registro.horaend}\n`
            relatorioTexto += `Equipamento: ${registro.equipamento}\n`;
            relatorioTexto += `Manutenção: ${registro.tipoManutencao}\n`;        
            relatorioTexto += `Tipo: ${registro.tipoInt}\n`;
            relatorioTexto += `Observação: ${registro.pecas}\n`;
            relatorioTexto += "----------------------------------------\n";
            
            dadosExcel.push([registro.setor, registro.nome, dataFormatada, registro.dateend, registro.hora, registro.horaend, registro.equipamento, registro.tipoManutencao, registro.tipoInt, registro.pecas]);  // Adiciona "Nome" ao Excel
        });

        let preRelatorio = document.createElement("pre");
        preRelatorio.style.fontSize = "14px";
        preRelatorio.textContent = relatorioTexto;
        resultado.appendChild(preRelatorio);

        let botaoSalvarExcel = document.createElement("button");
        botaoSalvarExcel.textContent = "Salvar Relatório em Excel";
        botaoSalvarExcel.classList.add("btn", "btn-info", "mt-2");
        botaoSalvarExcel.style.width = "100%";
        botaoSalvarExcel.style.fontSize = "16px";
        botaoSalvarExcel.style.color = "white"
        botaoSalvarExcel.style.backgroundColor = " rgb(0, 112, 0)"
        botaoSalvarExcel.onclick = () => salvarRelatorioExcel(dadosExcel);
        resultado.appendChild(botaoSalvarExcel);
    });
}

function salvarRelatorioExcel(dados) {
    let ws = XLSX.utils.aoa_to_sheet(dados);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório");
    XLSX.writeFile(wb, "relatorio_manutencao.xlsx");
}
