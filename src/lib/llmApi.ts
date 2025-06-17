import cidadesData from '../data/cidades.json';

type CamaraMunicipal = {
    endereco?: string;
    horario: string;
    contacto?: string;
    email?: string;
    link?: string;
};

type CentroSaude = {
    horarioGeral?: string;
    horario?: string;
    hospital?: string;
    link?: string;
};

type CartaoCidadao = {
    espacoCidadao?: string;
    agenda?: string;
    agendamento?: string;
    link?: string;
};

type Transportes = {
    redeUrbana?: string;
    info?: string;
    metro?: string;
    autocarros?: string;
    comboios?: string;
    ferries?: string;
    aeroporto?: string;
    marina?: string;
    teleférico?: string;
    link?: string;
    linkMetro?: string;
    linkAutocarros?: string;
};

type Cidade = {
    nome: string;
    camaraMunicipal: CamaraMunicipal;
    centroSaude?: CentroSaude;
    centrosSaude?: CentroSaude;
    cartaoCidadao: CartaoCidadao;
    transportes: Transportes;
};

type CidadesData = {
    cidades: Cidade[];
};

// Função melhorada para lidar com o Ollama
async function getFallbackFromOllama(message: string): Promise<string> {
    try {
        console.log('🔄 Consultando Ollama para:', message);
        
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'mistral',
                prompt: `Você é um assistente especializado em informações sobre Portugal. 
                        Responda de forma útil e informativa à seguinte pergunta: ${message}
                        
                        Se a pergunta for sobre serviços municipais de uma cidade específica que você não conhece,
                        sugira que o utilizador verifique o website oficial da câmara municipal dessa cidade.`,
                stream: false,
                options: {
                    temperature: 0.7,
                    max_tokens: 500
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro Ollama:', response.status, errorText);
            return `❌ Não foi possível obter uma resposta no momento. Tente novamente mais tarde.\n\n💡 **Sugestão**: Para informações sobre serviços municipais específicos, consulte diretamente o website da câmara municipal da sua cidade.`;
        }

        const data = await response.json();
        const ollamaResponse = data.response || 'Sem resposta disponível.';
        
        // Adiciona um prefixo para identificar respostas do Ollama
        return `🤖 **Resposta assistida por IA:**\n\n${ollamaResponse}`;
        
    } catch (err: any) {
        console.error('Erro ao conectar com Ollama:', err);
        return `❌ Serviço temporariamente indisponível.\n\n💡 **Em caso de dúvidas sobre serviços municipais**: Contacte diretamente a câmara municipal da sua cidade ou visite o Portal do Cidadão (www.portaldocidadao.pt).`;
    }
}

// Função para normalizar texto (remove acentos e converte para minúsculas)
function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// Função melhorada para encontrar cidades com busca mais flexível
function findCidade(message: string): Cidade | undefined {
    const normalizedMessage = normalizeText(message);
    
    return (cidadesData.cidades as Cidade[]).find(cidade => {
        const normalizedCidade = normalizeText(cidade.nome);
        
        // Busca exata
        if (normalizedMessage.includes(normalizedCidade)) {
            return true;
        }
        
        // Busca por palavras parciais (para casos como "porto" em "Porto")
        const cidadeWords = normalizedCidade.split(' ');
        return cidadeWords.some(word => 
            word.length > 2 && normalizedMessage.includes(word)
        );
    });
}

export async function getResponseFromLLM(message: string): Promise<string> {
    const originalMessage = message;
    const msg = normalizeText(message);

    // Detecção de intenções melhorada
    const querCamara = msg.includes('camara') || msg.includes('municipal') || msg.includes('autarquia');
    const querCartao = msg.includes('cartao') && (msg.includes('cidadao') || msg.includes('identidade'));
    const querTransportes = msg.includes('transporte') || msg.includes('autocarro') || 
                           msg.includes('metro') || msg.includes('comboio') || msg.includes('ferry');
    const querCentroSaude = msg.includes('centro') && msg.includes('saude') || 
                           msg.includes('hospital') || msg.includes('medico') || msg.includes('clinica');

    // Busca da cidade melhorada
    const cidadeEncontrada = findCidade(message);

    // Resposta para Câmara Municipal
    if (cidadeEncontrada && querCamara) {
        let resposta = `📌 **Câmara Municipal de ${cidadeEncontrada.nome}**\n\n`;
        resposta += `⏰ **Horário de Atendimento**: ${cidadeEncontrada.camaraMunicipal.horario}\n`;
        
        if (cidadeEncontrada.camaraMunicipal.endereco) {
            resposta += `📍 **Endereço**: ${cidadeEncontrada.camaraMunicipal.endereco}\n`;
        }
        if (cidadeEncontrada.camaraMunicipal.contacto) {
            resposta += `📞 **Contacto**: ${cidadeEncontrada.camaraMunicipal.contacto}\n`;
        }
        if (cidadeEncontrada.camaraMunicipal.email) {
            resposta += `✉️ **Email**: ${cidadeEncontrada.camaraMunicipal.email}\n`;
        }
        if (cidadeEncontrada.camaraMunicipal.link) {
            resposta += `🌐 **Website**: [Aceder ao site oficial](${cidadeEncontrada.camaraMunicipal.link})\n`;
        }
        
        resposta += `\n💡 **Dica**: Muitos serviços podem ser tratados online através do Portal do Cidadão.`;
        return resposta;
    }

    // Resposta para Cartão de Cidadão
    if (cidadeEncontrada && querCartao) {
        let resposta = `📌 **Cartão de Cidadão em ${cidadeEncontrada.nome}**\n\n`;
        
        if (cidadeEncontrada.cartaoCidadao.espacoCidadao) {
            resposta += `⏰ **Horário do Espaço Cidadão**: ${cidadeEncontrada.cartaoCidadao.espacoCidadao}\n`;
        }
        if (cidadeEncontrada.cartaoCidadao.agendamento || cidadeEncontrada.cartaoCidadao.agenda) {
            const agendamento = cidadeEncontrada.cartaoCidadao.agendamento || cidadeEncontrada.cartaoCidadao.agenda;
            resposta += `📅 **Agendamento**: ${agendamento}\n`;
        }
        if (cidadeEncontrada.cartaoCidadao.link) {
            resposta += `🌐 **Mais informações**: [Aceder aqui](${cidadeEncontrada.cartaoCidadao.link})\n`;
        }
        
        resposta += `\n💡 **Lembre-se**: Pode também agendar online em www.portaldocidadao.pt`;
        return resposta;
    }

    // Resposta para Transportes
    if (cidadeEncontrada && querTransportes) {
        let resposta = `📌 **Transportes Públicos em ${cidadeEncontrada.nome}**\n\n`;
        const transportes = cidadeEncontrada.transportes;
        
        if (transportes.redeUrbana) {
            resposta += `🚌 **Rede Urbana**: ${transportes.redeUrbana}\n`;
        }
        if (transportes.autocarros) {
            resposta += `🚍 **Autocarros**: ${transportes.autocarros}\n`;
        }
        if (transportes.metro) {
            resposta += `🚇 **Metro**: ${transportes.metro}\n`;
        }
        if (transportes.comboios) {
            resposta += `🚂 **Comboios**: ${transportes.comboios}\n`;
        }
        if (transportes.ferries) {
            resposta += `⛴️ **Ferry**: ${transportes.ferries}\n`;
        }
        if (transportes.aeroporto) {
            resposta += `✈️ **Aeroporto**: ${transportes.aeroporto}\n`;
        }
        if (transportes.marina) {
            resposta += `⚓ **Marina**: ${transportes.marina}\n`;
        }
        if (transportes.teleférico) {
            resposta += `🚠 **Teleférico**: ${transportes.teleférico}\n`;
        }
        
        // Links úteis
        if (transportes.link) {
            resposta += `\n🌐 **Informações gerais**: [Aceder aqui](${transportes.link})\n`;
        }
        if (transportes.linkMetro) {
            resposta += `🌐 **Metro**: [Aceder aqui](${transportes.linkMetro})\n`;
        }
        if (transportes.linkAutocarros) {
            resposta += `🌐 **Autocarros**: [Aceder aqui](${transportes.linkAutocarros})\n`;
        }
        
        return resposta;
    }

    // Resposta para Centros de Saúde
    if (cidadeEncontrada && querCentroSaude) {
        let resposta = `📌 **Serviços de Saúde em ${cidadeEncontrada.nome}**\n\n`;
        
        const centroSaude = cidadeEncontrada.centroSaude || cidadeEncontrada.centrosSaude;
        
        if (centroSaude) {
            if (centroSaude.horarioGeral || centroSaude.horario) {
                const horario = centroSaude.horarioGeral || centroSaude.horario;
                resposta += `⏰ **Horário de Funcionamento**: ${horario}\n`;
            }
            if (centroSaude.hospital) {
                resposta += `🏥 **Hospital de Referência**: ${centroSaude.hospital}\n`;
            }
            if (centroSaude.link) {
                resposta += `🌐 **Mais informações**: [Aceder aqui](${centroSaude.link})\n`;
            }
        }
        
        resposta += `\n💡 **Importante**: Para emergências ligue 112. Para marcação de consultas contacte o seu centro de saúde diretamente.`;
        return resposta;
    }

    // Casos onde não foi encontrada cidade específica - ENVIAR PARA OLLAMA
    if (!cidadeEncontrada && (querCamara || querCartao || querTransportes || querCentroSaude)) {
        console.log('🔍 Cidade não encontrada nos dados, enviando para Ollama:', originalMessage);
        return await getFallbackFromOllama(originalMessage);
    }

    // Caso onde a cidade foi encontrada mas não o serviço
    if (cidadeEncontrada && !(querCamara || querCartao || querTransportes || querCentroSaude)) {
        let resposta = `📍 **Informações sobre ${cidadeEncontrada.nome}**\n\n`;
        resposta += `Que tipo de informação pretende? Escolha uma das opções:\n\n`;
        resposta += `🏛️ **Câmara Municipal**: "horário da câmara municipal de ${cidadeEncontrada.nome}"\n`;
        resposta += `🆔 **Cartão de Cidadão**: "cartão de cidadão em ${cidadeEncontrada.nome}"\n`;
        resposta += `🚌 **Transportes**: "transportes públicos em ${cidadeEncontrada.nome}"\n`;
        resposta += `🏥 **Saúde**: "centros de saúde em ${cidadeEncontrada.nome}"`;
        
        return resposta;
    }

    // Fallback para Ollama com mensagem melhorada
    console.log('📤 Enviando para Ollama:', originalMessage);
    return await getFallbackFromOllama(originalMessage);
}