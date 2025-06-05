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
        return `O horário da Câmara de ${cidadeEncontrada.nome} é ${cidadeEncontrada.camaraMunicipal.horario} (${cidadeEncontrada.camaraMunicipal.endereco}).`;
    }

    if (cidadeEncontrada && querCartao && cidadeEncontrada.servicosPublicos) {
        const cartao = cidadeEncontrada.servicosPublicos.find(s => s.nome.toLowerCase().includes('cartão de cidadão'));
        if (cartao) {
            return `Pode tratar do Cartão de Cidadão em ${cartao.endereco}, das ${cartao.horario}.`;
        }
    }

    if (cidadeEncontrada && querTransportes && cidadeEncontrada.transportes) {
        const transportes = Object.entries(cidadeEncontrada.transportes)
            .map(([tipo, info]) => `${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: ${info}`)
            .join(' | ');
        return `Transportes em ${cidadeEncontrada.nome}: ${transportes}`;
    }

    if (cidadeEncontrada && querCentroSaude && cidadeEncontrada.centrosSaude && cidadeEncontrada.centrosSaude.length > 0) {
        const centros = cidadeEncontrada.centrosSaude
            .map(cs => `${cs.nome} (${cs.endereco}) - ${cs.horario}`)
            .join(' | ');
        return `Centros de Saúde em ${cidadeEncontrada.nome}: ${centros}`;
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

    return 'Desculpe, ainda não tenho essa informação.';
}