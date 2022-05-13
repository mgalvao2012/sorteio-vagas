# Projeto SVE
Sorteio de Vagas de Estacionamento do Condomínio Grandlife Ipiranga

*Objetivo:* simplificar a vida dos condôminos em um processo que normalmente é manual, desgastante e que consome muito tempo durante as reuniões de condomínio.

Autor: Marcelo Galvão

### O aplicativo é bastante simples e fácil de usar. Basicamente temos dois tipos de usuários: Comum e Síndico.

#### 1. Usuário Comum
  Este tipo de usuário tem acesso a um menu com as seguintes opções:
  - "Meus Dados" - utilizado para indicar sua unidade (apartamento), bem como, de maneira opcional, definir seus grupos de vagas preferenciais. 
  - "Vagas" - utilizado para visualizar quais são os grupos de vagas que estão disponíveis para serem sorteadas.

#### 2. Usuário Síndico
  Este tipo de usuário tem acesso a um menu com as seguintes opções:
  - "Meus Dados" - utilizado para indicar sua unidade (apartamento), bem como, de maneira opcional, definir seus grupos de vagas preferenciais. 
  - "Vagas" - utilizado para visualizar e definir quais são os grupos de vagas que estão disponíveis para serem sorteadas.
  - "Unidades" - utilizado para visualizar todas a unidades e para cada uma delas definir se há moradores "Portadores de Necessidades Especiais", se a unidade está adimplente ou não em relação aos pagamentos do condomínio e se algum usuário se registrado para a unidade. 
  - "Sorteio" - utilizado para definir quais unidades estão presentes no sorteio, visualizar quais unidades possuem usuário registrado e quais foram os grupos de vagas preferenciais escolhidos. Neste menu também é possível executar o sorteio das vagas.
  - "Setup" -  utilizado para reiniciar todo o banco de dados, ou seja, todas as unidades com usuários e todas os grupos de vagas escolhidos serão perdidos. Este processo é irreversível e por essa razão sua execução exige uma confirmação adicional. Um código é enviado por email para o usuário que deve informá-lo para que o processo seja executado até o final.

### Processo de Sorteio

Ao iniciar o processo o síndico pode visualizar e exportar a lista completa de unidades com indicação se possuem usuário registrado e quais foram os grupos de vagas preferenciais escolhidos. A exportação deve ser realizada através do browser que possuem a função "exportar para PDF".

O condomínio definiu as seguintes prioridade que devem ser observadas para a execução do sorteio:
1. sorteio de unidades COM portadores de necessidade especiais
2. sorteio de unidades SEM portadores de necessidade especiais, PRESENTES e ADIMPLENTES
3. sorteio de unidades SEM portadores de necessidade especiais, PRESENTES e INADIMPLENTES
4. sorteio de unidades SEM portadores de necessidade especiais e AUSENTES

Ao final do processo, é recomendado que o resultado do sorteio também seja exportado para o formato PDF, desta forma o síndico pode compartilhar com todos os condôminos o resultado do sorteio.

*Importante:* para acessar todas essas funções acima cada usuário precisa primeiro se cadastrar. Este processo é realizado através do menu "Login" e da opção "Registrar-se". É possível fazer um cadastro com email e senha ou através do autorização de uso do seu usuário do gmail, desta forma, não preciso definir uma nova senha.

## Instruções para instalação e configuração da aplicação

### Crie uma aplicação no Heroku (https://www.heroku.com)

...

