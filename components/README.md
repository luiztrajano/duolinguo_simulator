# DET Simulator - Simulador do Duolingo English Test

Sistema completo de simulação do Duolingo English Test desenvolvido como site estático para prática e preparação para a prova.

## 🎯 Funcionalidades

- **19 tipos de questões** do DET implementados
- **Sistema de pontuação automática** com algoritmo Levenshtein Distance
- **Feedback corretivo** imediato no modo prática
- **Histórico de progresso** com armazenamento local
- **Simulados cronometrados** imitando a prova real
- **Modo prática** com feedback detalhado após cada questão
- **Gravação de áudio** para questões de speaking
- **Interface moderna** inspirada no Duolingo

## 📁 Estrutura do Projeto

```
det-simulator/
├── index.html                 # Página principal
├── css/
│   └── styles.css            # Estilos completos
├── js/
│   ├── app.js                # Controlador principal
│   ├── store.js              # Gerenciamento de estado
│   ├── timer.js              # Timer com correção de drift
│   ├── recorder.js           # Gravação de áudio
│   ├── storage.js            # Persistência de dados
│   ├── grader.js             # Lógica de correção
│   └── questions/
│       ├── questionBank.js    # Banco de questões
│       └── questionRenderers.js # Renderizadores
├── assets/
│   ├── images/               # Imagens para questões
│   └── audio/                # Arquivos de áudio
└── data/
    └── questions.json        # Dados de questões
```

## 🚀 Como Usar

### Instalação

1. **Faça o download** de todos os arquivos
2. **Mantenha a estrutura de pastas** intacta
3. **Abra o arquivo `index.html`** em um navegador moderno

**Importante**: Para funcionar completamente, você precisa:
- Navegador moderno (Chrome, Firefox, Edge, Safari 14.1+)
- Permissão de microfone para questões de speaking
- JavaScript habilitado

### Modos de Uso

#### Modo Prática
- Feedback imediato após cada questão
- Sem limite de tempo (ou timers opcionais)
- Ideal para aprender e melhorar

#### Simulado Completo
- Simula o teste real com 52 questões
- Cronômetro ativo
- Feedback apenas no final
- ~60 minutos de duração

## 🎮 Funcionalidades Principais

### Tipos de Questões Implementados

1. **Read and Select** - Identificar palavras reais
2. **Fill in the Blanks** - Completar lacunas em frases
3. **Read and Complete** - C-test (completar palavras parciais)
4. **Listen and Type** - Transcrever áudio
5. **Write About the Photo** - Descrever imagem
6. **Speak About the Photo** - Falar sobre imagem
7. **Interactive Writing** - Escrita interativa (2 partes)
8. **Read Then Speak** - Ler e responder oralmente
9. **Interactive Speaking** - Conversa com 6 perguntas
10. **Interactive Reading** - 5 sub-tipos de leitura
11. **Interactive Listening** - Compreensão de conversas
12. **Summarize the Conversation** - Resumir conversa
13. **Writing Sample** - Redação livre
14. **Speaking Sample** - Fala livre

### Sistema de Pontuação

- **Correção automática** para questões objetivas
- **Levenshtein Distance** para questões de ditado
- **Rubrica heurística** para questões de escrita
- **Auto-avaliação guiada** para questões de speaking
- **Escala DET** (10-160) com equivalência CEFR

### Armazenamento de Dados

- **localStorage**: Histórico de pontuações, preferências
- **IndexedDB**: Gravações de áudio, dados complexos
- **Persistência total**: Dados mantidos entre sessões

## 🎨 Personalização

### Adicionar Novas Questões

Edite o arquivo `js/questions/questionBank.js`:

```javascript
// Exemplo: Adicionar uma nova questão Read and Select
readAndSelect: [
    {
        id: "rs011",
        word: "PERSPICACIOUS",
        isReal: true,
        difficulty: 3
    }
]
```

### Modificar Temas de Cores

Edite as variáveis CSS em `css/styles.css`:

```css
:root {
    --primary: #58CC02;  /* Verde Duolingo */
    --secondary: #1CB0F6; /* Azul */
    /* ... outras cores ... */
}
```

## 📊 Estratégias para 95+ Pontos

1. **Pratique Read and Complete** - Aparece 3-6x e vale muito
2. **Domine Listen and Type** - 6-9 questões, crucial para Listening
3. **Dedique tempo ao Write About Photo** - 3 questões, impacto alto
4. **Não negligencie os Samples** - Agora contam para a pontuação
5. **Use todo o tempo disponível** - Velocidade NÃO dá bônus
6. **Revise suas respostas escritas** - 10 segundos de revisão por minuto

### Template para Write About the Photo

1. **Descrição objetiva**: "In this photo, I see..."
2. **Inferência**: "They appear to be... It seems like..."
3. **Contexto**: "Based on the clothing/weather/setting..."

## 🔧 Troubleshooting

### O microfone não funciona
- Verifique as permissões do navegador
- Tente recarregar a página
- Use HTTPS ou localhost

### O timer está impreciso
- O timer usa `performance.now()` para máxima precisão
- Evite alternar entre abas durante o teste

### Os dados não estão salvando
- Verifique se os cookies/localStorage estão habilitados
- Modo anônimo pode limitar armazenamento
- Limpe o cache se houver problemas

## 🌐 Deploy

### GitHub Pages

1. Faça upload dos arquivos para um repositório GitHub
2. Vá em Settings > Pages
3. Selecione a branch main
4. Acesse em `https://seu-usuario.github.io/det-simulator`

### Netlify

1. Arraste a pasta do projeto para Netlify Drop
2. Ou conecte seu repositório GitHub
3. Deploy automático!

### Servidor Local

```bash
# Com Python
python -m http.server 8000

# Com Node.js
npx http-server

# Acesse em http://localhost:8000
```

## 📝 Notas Importantes

- Este é um **simulador educacional**, não o teste oficial
- A pontuação é **aproximada** e pode variar do teste real
- Algumas questões usam **síntese de voz** no lugar de áudio real
- **Pratique regularmente** para melhores resultados

## 🎯 Meta da Esposa

**Objetivo**: 95+ pontos
**Prazo**: Próximo mês
**Recomendação**: 
- 1 simulado completo por semana
- Modo prática diário (30-60 min)
- Foco especial em Read and Complete, Listen and Type e Write About Photo

## 🔄 Atualizações Futuras

- [ ] Mais questões no banco de dados
- [ ] Áudio real gravado profissionalmente
- [ ] Análise avançada de progresso
- [ ] Exportação de resultados em PDF
- [ ] Comparação com scores de universidades

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais. O Duolingo English Test é marca registrada da Duolingo, Inc.

---

**Desenvolvido com ❤️ para ajudar sua esposa a alcançar 95+ pontos no DET!**
