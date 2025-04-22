        // Definição dos dias e horários
        const dias = [null, 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const horarios = [
            '07:30 - 08:15',
            '08:15 - 09:00',
            '09:15 - 10:00',
            '10:00 - 10:45',
            '11:00 - 11:45',
            '11:45 - 12:30',
            '13:30 - 14:15',
            '14:15 - 15:00',
            '15:15 - 16:00',
            '16:00 - 16:45',
            '17:00 - 17:45',
            '17:45 - 18:30',
            '19:00 - 19:45',
            '19:45 - 20:30',
            '20:45 - 21:30',
            '21:30 - 22:15'
        ];

        let darkMode = true;

        // Estrutura para armazenar os horários ocupados
        let occupiedSlots = {};

        // Variável para armazenar o ID da disciplina em edição
        let disciplinaEmEdicaoId = null;

        // Gera a grade de horários vazia
        function gerarGrade() {
            const timetable = document.getElementById('timetable');
            timetable.innerHTML = '';

            // Cabeçalho vazio para a coluna de horários
            const emptyHeaderCell = document.createElement('div');
            emptyHeaderCell.classList.add('cell', 'header');
            timetable.appendChild(emptyHeaderCell);

            // Cabeçalhos dos dias
            for (let i = 1; i < dias.length; i++) {
                const headerCell = document.createElement('div');
                headerCell.classList.add('cell', 'header');
                headerCell.innerText = dias[i];
                timetable.appendChild(headerCell);
            }

            // Células de horário
            for (let i = 0; i < horarios.length; i++) {
                // Célula de horário na primeira coluna
                const timeCell = document.createElement('div');
                timeCell.classList.add('cell', 'time-cell');
                timeCell.innerText = horarios[i];
                timetable.appendChild(timeCell);

                // Células dos dias
                for (let j = 1; j < dias.length; j++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    timetable.appendChild(cell);
                }
            }
        }

        // Salva a grade no localStorage
        function saveSchedule() {
            localStorage.setItem('occupiedSlots', JSON.stringify(occupiedSlots));
        }

        // Carrega a grade do localStorage
        function loadSchedule() {
            const storedSlots = localStorage.getItem('occupiedSlots');
            if (storedSlots) {
                occupiedSlots = JSON.parse(storedSlots);
                for (let slotKey in occupiedSlots) {
                    const slot = occupiedSlots[slotKey];
                    const [indiceDia, indiceHorario] = slotKey.split('-').map(Number);
                    const cellIndex = (indiceHorario * (dias.length)) + indiceDia;
                    const cell = document.getElementsByClassName('cell')[dias.length + cellIndex];

                    // Criação do card
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `<strong>${slot.disciplina}</strong><br>${slot.professor}`;

                    // Adicionar event listener para abrir o modal
                    card.addEventListener('click', function() {
                        abrirModal(slot.id);
                    });

                    cell.appendChild(card);
                }
            }
        }

        // Adiciona a disciplina na grade com base no código
        function adicionarDisciplina() {
            const nomeDisciplina = document.getElementById('nomeDisciplina').value.trim();
            const nomeProfessor = document.getElementById('nomeProfessor').value.trim();
            const codigoHorario = document.getElementById('codigoHorario').value.toUpperCase().trim();

            if (!nomeDisciplina || !nomeProfessor || !codigoHorario) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            // Análise do código de horário
            const diasCodigoMatch = codigoHorario.match(/^[2-7]+/g);
            const periodoMatch = codigoHorario.match(/[MTN]/g);
            const horariosCodigoMatch = codigoHorario.match(/\d+$/g);

            if (!diasCodigoMatch || !periodoMatch || !horariosCodigoMatch) {
                alert('Código de horário inválido. Por favor, siga o formato correto.');
                return;
            }

            const diasCodigo = diasCodigoMatch[0].split('');
            const periodo = periodoMatch[0];
            const horariosCodigo = horariosCodigoMatch[0].split('');

            // Mapeamento de período para índices de horários
            let offset;
            if (periodo === 'M') {
                offset = 0;
            } else if (periodo === 'T') {
                offset = 6;
            } else if (periodo === 'N') {
                offset = 12;
            } else {
                alert('Período inválido. Use M, T ou N.');
                return;
            }

            const conflictingSlots = [];
            const slotsToOccupy = [];

            const disciplinaId = Date.now(); // ID único para a disciplina

            // Primeiro, verificar conflitos
            diasCodigo.forEach(dia => {
                horariosCodigo.forEach(horario => {
                    const indiceDia = parseInt(dia) - 1; // Ajuste no índice do dia
                    const indiceHorario = offset + parseInt(horario) - 1;

                    // Cálculo do índice da célula na grade
                    const cellIndex = (indiceHorario * (dias.length)) + indiceDia;

                    const slotKey = `${indiceDia}-${indiceHorario}`;
                    if (occupiedSlots[slotKey]) {
                        conflictingSlots.push({
                            dia: dias[parseInt(dia)],
                            horario: horarios[indiceHorario],
                            disciplina: occupiedSlots[slotKey].disciplina,
                            professor: occupiedSlots[slotKey].professor
                        });
                    } else {
                        slotsToOccupy.push({
                            indiceDia,
                            indiceHorario,
                            cellIndex,
                            slotKey
                        });
                    }
                });
            });

            if (conflictingSlots.length > 0) {
                let mensagem = 'Conflito de horário detectado com as seguintes disciplinas:\n';
                conflictingSlots.forEach(conflict => {
                    mensagem += `- ${conflict.disciplina} (${conflict.professor}) em ${conflict.dia}, ${conflict.horario}\n`;
                });
                alert(mensagem);
                return;
            }

            // Se não houver conflitos, adicionar a disciplina
            slotsToOccupy.forEach(slot => {
                const { indiceDia, indiceHorario, cellIndex, slotKey } = slot;

                // Como adicionamos uma coluna a mais para os horários, precisamos somar mais uma posição
                const cell = document.getElementsByClassName('cell')[dias.length + cellIndex];

                // Criação do card
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `<strong>${nomeDisciplina}</strong><br>${nomeProfessor}`;

                // Adicionar event listener para abrir o modal
                card.addEventListener('click', function() {
                    abrirModal(disciplinaId);
                });

                cell.appendChild(card);

                // Marcar o slot como ocupado
                occupiedSlots[slotKey] = {
                    id: disciplinaId,
                    disciplina: nomeDisciplina,
                    professor: nomeProfessor,
                    codigoHorario: codigoHorario
                };
            });

            // Salvar a grade atualizada
            saveSchedule();

            // Limpar os campos de entrada
            document.getElementById('nomeDisciplina').value = '';
            document.getElementById('nomeProfessor').value = '';
            document.getElementById('codigoHorario').value = '';
        }

        // Função para abrir o modal
        function abrirModal(disciplinaId) {
            disciplinaEmEdicaoId = disciplinaId;
            const slots = Object.entries(occupiedSlots).filter(([key, value]) => value.id === disciplinaId);
            if (slots.length === 0) {
                return; // Nenhum slot encontrado
            }

            const disciplina = slots[0][1];

            // Preencher os campos do modal com os dados atuais
            document.getElementById('modalNomeDisciplina').value = disciplina.disciplina;
            document.getElementById('modalNomeProfessor').value = disciplina.professor;
            document.getElementById('modalCodigoHorario').value = disciplina.codigoHorario;

            // Exibir o modal
            document.getElementById('modal').style.display = 'block';
        }

        // Função para fechar o modal
        function fecharModal() {
            document.getElementById('modal').style.display = 'none';
            disciplinaEmEdicaoId = null;
        }

        // Função para salvar as alterações no modal
        function salvarEdicao() {
            const novoNomeDisciplina = document.getElementById('modalNomeDisciplina').value.trim();
            const novoNomeProfessor = document.getElementById('modalNomeProfessor').value.trim();
            const novoCodigoHorario = document.getElementById('modalCodigoHorario').value.toUpperCase().trim();

            if (!novoNomeDisciplina || !novoNomeProfessor || !novoCodigoHorario) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            // Remover a disciplina atual
            removerDisciplina(disciplinaEmEdicaoId, false);

            // Temporariamente armazenar o occupiedSlots atual
            const occupiedSlotsTemp = { ...occupiedSlots };

            // Atualizar os dados da disciplina
            const nomeDisciplina = novoNomeDisciplina;
            const nomeProfessor = novoNomeProfessor;
            const codigoHorario = novoCodigoHorario;
            const disciplinaId = disciplinaEmEdicaoId;

            // Reutilizar a função adicionarDisciplina com os novos dados
            // Porém, precisamos adaptar a função para aceitar parâmetros

            const resultado = adicionarDisciplinaEditada(nomeDisciplina, nomeProfessor, codigoHorario, disciplinaId);

            if (resultado) {
                // Fechar o modal
                fecharModal();
            } else {
                // Se houve conflito, restaurar o occupiedSlots original
                occupiedSlots = { ...occupiedSlotsTemp };
                saveSchedule();
            }
        }

        // Função para adicionar disciplina editada
        function adicionarDisciplinaEditada(nomeDisciplina, nomeProfessor, codigoHorario, disciplinaId) {
            // (O código desta função é semelhante ao adicionarDisciplina, mas adaptado)
            // Análise do código de horário
            const diasCodigoMatch = codigoHorario.match(/^[2-7]+/g);
            const periodoMatch = codigoHorario.match(/[MTN]/g);
            const horariosCodigoMatch = codigoHorario.match(/\d+$/g);

            if (!diasCodigoMatch || !periodoMatch || !horariosCodigoMatch) {
                alert('Código de horário inválido. Por favor, siga o formato correto.');
                return false;
            }

            const diasCodigo = diasCodigoMatch[0].split('');
            const periodo = periodoMatch[0];
            const horariosCodigo = horariosCodigoMatch[0].split('');

            // Mapeamento de período para índices de horários
            let offset;
            if (periodo === 'M') {
                offset = 0;
            } else if (periodo === 'T') {
                offset = 6;
            } else if (periodo === 'N') {
                offset = 12;
            } else {
                alert('Período inválido. Use M, T ou N.');
                return false;
            }

            const conflictingSlots = [];
            const slotsToOccupy = [];

            // Primeiro, verificar conflitos
            diasCodigo.forEach(dia => {
                horariosCodigo.forEach(horario => {
                    const indiceDia = parseInt(dia) - 1; // Ajuste no índice do dia
                    const indiceHorario = offset + parseInt(horario) - 1;

                    // Cálculo do índice da célula na grade
                    const cellIndex = (indiceHorario * (dias.length)) + indiceDia;

                    const slotKey = `${indiceDia}-${indiceHorario}`;
                    if (occupiedSlots[slotKey]) {
                        conflictingSlots.push({
                            dia: dias[parseInt(dia)],
                            horario: horarios[indiceHorario],
                            disciplina: occupiedSlots[slotKey].disciplina,
                            professor: occupiedSlots[slotKey].professor
                        });
                    } else {
                        slotsToOccupy.push({
                            indiceDia,
                            indiceHorario,
                            cellIndex,
                            slotKey
                        });
                    }
                });
            });

            if (conflictingSlots.length > 0) {
                let mensagem = 'Conflito de horário detectado com as seguintes disciplinas:\n';
                conflictingSlots.forEach(conflict => {
                    mensagem += `- ${conflict.disciplina} (${conflict.professor}) em ${conflict.dia}, ${conflict.horario}\n`;
                });
                alert(mensagem);
                return false;
            }

            // Se não houver conflitos, adicionar a disciplina
            slotsToOccupy.forEach(slot => {
                const { indiceDia, indiceHorario, cellIndex, slotKey } = slot;

                // Como adicionamos uma coluna a mais para os horários, precisamos somar mais uma posição
                const cell = document.getElementsByClassName('cell')[dias.length + cellIndex];

                // Remover qualquer conteúdo anterior
                cell.innerHTML = '';

                // Criação do card
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `<strong>${nomeDisciplina}</strong><br>${nomeProfessor}`;

                // Adicionar event listener para abrir o modal
                card.addEventListener('click', function() {
                    abrirModal(disciplinaId);
                });

                cell.appendChild(card);

                // Marcar o slot como ocupado
                occupiedSlots[slotKey] = {
                    id: disciplinaId,
                    disciplina: nomeDisciplina,
                    professor: nomeProfessor,
                    codigoHorario: codigoHorario
                };
            });

            // Salvar a grade atualizada
            saveSchedule();

            return true;
        }

        // Função para remover disciplina
        function removerDisciplina(disciplinaId, atualizarTela = true) {
            const slotsToRemove = Object.entries(occupiedSlots).filter(([key, value]) => value.id === disciplinaId);

            slotsToRemove.forEach(([slotKey, value]) => {
                const [indiceDia, indiceHorario] = slotKey.split('-').map(Number);
                const cellIndex = (indiceHorario * (dias.length)) + indiceDia;
                const cell = document.getElementsByClassName('cell')[dias.length + cellIndex];
                cell.innerHTML = '';

                // Remover o slot do occupiedSlots
                delete occupiedSlots[slotKey];
            });

            // Salvar a grade atualizada
            saveSchedule();

            if (atualizarTela) {
                // Fechar o modal
                fecharModal();
            }
        }

        // Função para excluir disciplina
        function excluirDisciplina() {
            if (confirm('Tem certeza que deseja excluir esta disciplina?')) {
                removerDisciplina(disciplinaEmEdicaoId);
                fecharModal();
            }
        }

        // Alterna o modo escuro/claro
        function toggleLightMode() {
            darkMode = !darkMode;
            if (darkMode) {
                document.body.classList.remove('light-mode');
                document.getElementById('lightModeButton').innerText = 'Ativar Modo Claro';
            } else {
                document.body.classList.add('light-mode');
                document.getElementById('lightModeButton').innerText = 'Ativar Modo Escuro';
            }
        }

        // Salva a grade como imagem
        function salvarComoImagem() {
            const tabela = document.getElementById('timetable');
            html2canvas(tabela).then(canvas => {
                const link = document.createElement('a');
                link.download = 'grade-horaria.png';
                link.href = canvas.toDataURL();
                link.click();
            });
        }

        // Inicializa a grade ao carregar a página
        window.onload = function() {
            gerarGrade();
            // Iniciar no modo escuro por padrão
            darkMode = true;
            document.body.classList.remove('light-mode');
            document.getElementById('lightModeButton').innerText = 'Ativar Modo Claro';
            // Carregar a grade do localStorage
            loadSchedule();
        };

        // ... (código existente)

// Função para baixar o PDF
function baixarPDF() {
    // Caminho para o arquivo PDF
    const pdfUrl = 'OfertaDCOMP-2025.pdf';

    // Cria um link temporário
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'OfertaDCOMP-2025.pdf';
    link.click();
}

// Função para limpar todas as disciplinas adicionadas
function limparMaterias() {
    if (confirm('Deseja realmente limpar todas as disciplinas adicionadas?')) {
        // Remove os dados do localStorage
        localStorage.removeItem('occupiedSlots');
        // Limpa o objeto de horários ocupados
        occupiedSlots = {};
        // Regenera a grade para limpar todos os cards
        gerarGrade();
        alert('Todas as disciplinas foram removidas.');
    }
}
