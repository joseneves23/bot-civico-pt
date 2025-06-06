import cidadesData from '../data/cidades.json';


type ServicoPublico = {
    nome: string;
    endereco: string;
    horario: string;
};

type Cidade = {
    nome: string;
    camaraMunicipal: { horario: string; endereco: string };
    transportes?: Record<string, string | undefined>;
    centrosSaude?: { nome: string; endereco: string; horario: string }[];
    servicosPublicos?: ServicoPublico[];
};

async function getFallbackFromOllama(message: string): Promise<string> {
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'mistral',
                prompt: message,
                stream: false
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return `Erro ao contactar o Ollama: ${response.status} - ${errorText}`;
        }

        const data = await response.json();
        return data.response || 'Sem resposta.';
    } catch (err: any) {
        console.error('Erro Ollama:', err);
        return 'Erro ao contactar o Ollama.';
    }
}




export async function getResponseFromLLM(message: string): Promise<string> {
    const msg = message.toLowerCase();

    const querCamara = msg.includes('câmara');
    const querCartao = msg.includes('cartão de cidadão');
    const querTransportes = msg.includes('transporte');
    const querCentroSaude = msg.includes('centro de saúde') || msg.includes('centros de saúde');

    const cidadeEncontrada = (cidadesData.cidades as Cidade[]).find(cidade =>
        msg.includes(cidade.nome.toLowerCase())
    );

    if (cidadeEncontrada && querCamara) {
        return (
            `Informação sobre a Câmara Municipal de ${cidadeEncontrada.nome}:\n\n` +
            `• Horário: ${cidadeEncontrada.camaraMunicipal.horario}\n` +
            `• Endereço: ${cidadeEncontrada.camaraMunicipal.endereco}`
        );
    }

    if (cidadeEncontrada && querCartao && cidadeEncontrada.servicosPublicos) {
        const cartao = cidadeEncontrada.servicosPublicos.find(s => s.nome.toLowerCase().includes('cartão de cidadão'));
        if (cartao) {
            return (
                `Locais para tratar do Cartão de Cidadão em ${cidadeEncontrada.nome}:\n\n` +
                `• Endereço: ${cartao.endereco}\n` +
                `• Horário: ${cartao.horario}`
            );
        }
    }

    if (cidadeEncontrada && querTransportes && cidadeEncontrada.transportes) {
        const transportes = Object.entries(cidadeEncontrada.transportes)
            .map(([tipo, info]) => `• ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: ${info}`)
            .join('\n');
        return (
            `Transportes em ${cidadeEncontrada.nome}:\n\n` +
            `${transportes}`
        );
    }

    if (cidadeEncontrada && querCentroSaude && cidadeEncontrada.centrosSaude && cidadeEncontrada.centrosSaude.length > 0) {
        const centros = cidadeEncontrada.centrosSaude
            .map(cs => `• ${cs.nome} (${cs.endereco}) - ${cs.horario}`)
            .join('\n');
        return (
            `Centros de Saúde em ${cidadeEncontrada.nome}:\n\n` +
            `${centros}`
        );
    }

    if (!cidadeEncontrada && (querCamara || querCartao || querTransportes || querCentroSaude)) {
        return 'Por favor, indique também a cidade sobre a qual pretende saber informações.';
    }

    if (cidadeEncontrada && !(querCamara || querCartao || querTransportes || querCentroSaude)) {

    return (
        `Por favor, indique o serviço ou informação que pretende saber sobre essa cidade. Exemplos:\n\n` +
        `• Câmara de ${cidadeEncontrada.nome}\n` +
        `• Cartão de Cidadão em ${cidadeEncontrada.nome}\n` +
        `• Transportes em ${cidadeEncontrada.nome}\n` +
        `• Centros de Saúde em ${cidadeEncontrada.nome}`
    );
}

    return await getFallbackFromOllama(message);
}