SIMGrade

Bem-vindo ao Simulador de Grade! Este é um webapp desenvolvido pela LAWD, ele permite visualizar e gerenciar suas grades horárias de forma interativa e intuitiva.
Índice

    Descrição
    Funcionalidades
    Tecnologias Utilizadas
    Como Executar o Projeto
    Instruções de Uso
    Organização dos Arquivos
    Contribuição
    Licença
    Agradecimentos

Descrição

O Simulador de Grade é uma ferramenta desenvolvida para auxiliar estudantes a planejar suas disciplinas de acordo com os horários disponíveis. Com uma interface moderna e amigável, o webapp permite adicionar disciplinas, verificar conflitos de horários, editar ou excluir disciplinas e salvar a grade como imagem.
Funcionalidades

    Adicionar Disciplinas: Insira o nome da disciplina, nome do professor e código de horário para adicionar à grade.
    Verificação de Conflitos: O sistema alerta se houver conflitos de horário com disciplinas já adicionadas.
    Editar/Excluir Disciplinas: Clique em uma disciplina na grade para abrir um modal que permite editar ou excluir.
    Salvar Grade: Salve a grade como imagem (PNG) para compartilhar ou imprimir.
    Modo Claro/Escuro: Alterne entre modo claro e escuro conforme sua preferência.
    Persistência de Dados: As disciplinas adicionadas são salvas no navegador, permitindo continuar de onde parou.
    

Tecnologias Utilizadas

    HTML5: Estrutura do webapp.
    CSS3: Estilização e design responsivo.
    JavaScript (ES6+): Funcionalidades interativas e manipulação do DOM.
    html2canvas: Biblioteca para salvar a grade como imagem.
    Google Fonts: Fonte "Roboto" para uma melhor tipografia.

Como Executar o Projeto

    Clone o repositório ou faça o download dos arquivos:

    bash

git clone https://github.com/seu-usuario/simulador-de-grade.git

Navegue até o diretório do projeto:

bash

    cd simulador-de-grade

    Abra o arquivo index.html em um navegador web:
        Você pode simplesmente arrastar o arquivo para uma janela do navegador ou
        Clicar com o botão direito no arquivo index.html e selecionar "Abrir com" e escolher seu navegador preferido.

Instruções de Uso

    Adicionando Disciplinas:
        Preencha os campos:
            Nome da Disciplina: Nome da matéria que deseja adicionar.
            Nome do Professor: Nome do professor responsável pela disciplina.
            Código de Horário: Código no formato DMTN (ex: 24T12).
                Dias: Números de 2 a 7 representando os dias da semana (Segunda a Sábado).
                Período:
                    M - Manhã
                    T - Tarde
                    N - Noite
                Horários: Números de 1 a 6 representando os horários no período.
        Clique em "Adicionar à Grade".

    Verificação de Conflitos:
        O sistema avisará se o horário desejado já está ocupado por outra disciplina.

    Editar ou Excluir Disciplinas:
        Clique em uma disciplina na grade para abrir o modal de edição.
        Faça as alterações necessárias ou clique em "Excluir Disciplina" para removê-la.

    Salvar Grade como Imagem:
        Clique em "Salvar Grade como Imagem" para baixar a grade atual em formato PNG.

    Alternar Modo Claro/Escuro:
        Clique em "Ativar Modo Claro" ou "Ativar Modo Escuro" para alternar entre os modos.

    Visualização das Disciplinas Adicionadas:
        As disciplinas adicionadas são listadas acima da grade para fácil referência.

Organização dos Arquivos

    index.html: Estrutura HTML do webapp.
    styles.css: Estilos e design do webapp.
    script.js: Lógica e funcionalidades interativas.
    README.md: Este documento.


Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
Agradecimentos

    Equipe Desenvolvedora: Agradecemos a todos os colaboradores que tornaram este projeto possível.
    Usuários: Obrigado por usar o Simulador de Grade Horária! Seu feedback é importante para nós.
    Comunidade: Agradecemos à comunidade de desenvolvedores pelas ferramentas e bibliotecas utilizadas.
