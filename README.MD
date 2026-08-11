# API FitStore

A API FitStore é um projeto acadêmico desenvolvido para a disciplina de Desenvolvimento Web - Backend. O objetivo principal é gerenciar o ecossistema de um e-commerce voltado para moda e produtos fitness, controlando tanto o catálogo de mercadorias quanto a equipe de colaboradores.

O sistema permite a realização de um CRUD completo de produtos, gerenciamento de estoque (vendas e reposições) e a inativação de itens. Além disso, a API gerencia uma equipe de funcionários e clientes, onde as permissões para modificar dados ou cadastrar produtos dependem de rigorosas regras de hierarquia (RBAC) e do status de atividade do colaborador no sistema.

Para facilitar o acompanhamento e agilizar o desenvolvimento, a aplicação conta com uma camada visual (Server-Side Rendering) que permite visualizar a vitrine de produtos, detalhes específicos de cada item, ferramentas de busca, listagem da equipe e telas de autenticação/cadastro.

## Ferramentas Utilizadas

- **Node.js e Express**: Ambiente de execução e framework para construção do servidor, rotas e manipulação de verbos HTTP.

- **MongoDB Atlas e Mongoose**: Banco de dados NoSQL em nuvem e biblioteca ODM (Object Data Modeling) para persistência de dados e modelagem rígida de esquemas.

- **JSON Web Token (JWT) e Bcrypt**: Implementação de autenticação stateless segura e criptografia irreversível de senhas.

- **Express-Validator**: Middleware utilizado para interceptar requisições e validar os dados de entrada (firewall sintático) antes do processamento.

- **Pug**: Motor de templates para renderização dinâmica das páginas web no lado do servidor.

- **Swagger UI**: Ferramenta para documentação interativa e automatizada da API REST baseada no padrão OpenAPI 3.0.

## Como Usar o Projeto

1. Clone o repositório para sua máquina local.
2. Abra o terminal na pasta raiz do projeto.
3. Instale as dependências necessárias executando:
   `npm install`
4. Crie um arquivo `.env` na raiz do projeto contendo as variáveis de ambiente necessárias:

```env
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
SALT_ROUNDS=10
MONGO_URI=sua_string_de_conexao_mongodb
NODE_ENV=development

```

5. Inicie o servidor com o comando:
   `npm start` ou `npm run dev`

### Acesso Visual

Após iniciar o servidor, você pode acessar as interfaces através do navegador:

- **Vitrine de Produtos**: http://localhost:3000/vitrine
- **Gestão de Equipe**: http://localhost:3000/equipe
- **Documentação da API (Swagger)**: http://localhost:3000/api-docs

### Envio de Requisições (API)

Para interagir com os endpoints da API de forma programática, recomenda-se o uso do arquivo `api_testes.http` fornecido no projeto utilizando a extensão REST Client/Thunder Client, ou via Postman.

#### Tutorial Thunder Client / Postman:

1. A API agora é protegida por JWT. O primeiro passo é realizar o login.

2. Faça um `POST` para `http://localhost:3000/api/auth/login` enviando `loginInput` e `senha` no corpo (JSON).

3. Copie o `token` retornado na resposta.

4. Nas requisições subsequentes (GET, POST, PATCH, DELETE), vá na aba **Headers** (ou Auth) e adicione:

- Chave: `Authorization`
- Valor: `Bearer SEU_TOKEN_COPIADO`

5. Na aba **Body**, selecione o formato **JSON** e insira os dados necessários.
6. Envie a requisição.

#### Exemplo de Requisição (Cadastro de Produto):

- **Método HTTP**: POST
- **URL**: http://localhost:3000/api/produtos
- **Header**: `Authorization: Bearer <seu_token_jwt_de_vendedor_ou_gerente>`
- **Body (JSON)**:

```json
{
  "referencia": "REG-055-CZ",
  "nome": "Regata Dry-Fit Cinza Estelar",
  "categoria": "Camisetas",
  "tamanho": "G",
  "preco": 55.0,
  "estoque": 12
}
```

- **Resultado Esperado**: Status `201 Created`. Após o sucesso, você pode acessar http://localhost:3000/vitrine para verificar a inclusão do novo item no catálogo.

## Arquitetura do Sistema

O projeto foi estruturado utilizando o princípio de Separation of Concerns (SoC) através do padrão de Arquitetura em Camadas:

1. **Models**: Esquemas do Mongoose que definem a estrutura, tipagem e restrições únicas no MongoDB Atlas.

2. **Repositório**: Camada de persistência isolada que interage diretamente com o banco de dados (Mongoose) para separar a infraestrutura das regras de negócio.

3. **DTO (Data Transfer Object)**: Filtro de saída responsável por sanitizar e formatar os dados antes de enviá-los na resposta (ex: ocultar hash de senhas e chaves internas `__v`).

4. **Service**: Concentra o coração lógico da aplicação (regras corporativas, validações de estoque, controle de auditoria e criptografia).

5. **Controllers**: Orquestradores de fluxo (MVC Web ou API REST) que recebem a requisição, enviam para os serviços e devolvem a resposta correta em JSON ou renderizam via Pug.

6. **Middlewares**: Interceptadores que realizam validação de JWT, verificação de RBAC (controle de acesso por cargos) e tratamento global de exceções.

7. **Validator**: Camada de firewall inicial (express-validator) para garantir a integridade dos tipos e obrigatoriedade dos dados na porta de entrada.

8. **Routes**: Mapeamento limpo dos endpoints aos seus respectivos verbos HTTP e controladores.

## Principais Endpoints

### Autenticação (/api/auth)

- `POST /login`: Valida as credenciais e devolve um Token JWT (Stateless).

- `POST /register`: Criação de conta pública (nasce nativamente como perfil `cliente`).

### Produtos (/api/produtos)

- `GET /`: Lista todos os produtos (Aberto ao público; visualização inativa oculta se não for gerente).

- `GET /:referencia`: Busca um produto específico pelo código de referência.

- `POST /`: Cadastra um novo produto no catálogo (Apenas Gerentes e Vendedores).

- `PUT /:referencia`: Atualização integral das informações do produto.

- `PATCH /:referencia/vender`: Registra uma venda e deduz fisicamente a quantidade do estoque.

- `PATCH /:referencia/repor`: Adiciona quantidade ao estoque de um item existente (Apenas Gerentes).

- `PATCH /:referencia/inativar`: Alterna o status do produto para inativo/ativo (Apenas Gerentes).

- `DELETE /:referencia`: Exclusão física do produto no banco (Apenas Gerentes).

### Usuários e Funcionários (/api/usuarios)

- `GET /`: Lista todos os membros da equipe e clientes (Apenas Gerentes).

- `GET /:username`: Busca dados de um colaborador pelo seu username.

- `POST /`: Contrata/Cadastra um novo colaborador operacional no sistema.

- `PATCH /:username`: Atualiza dados cadastrais ou promove de cargo.

- `DELETE /:username`: Inativa um funcionário (Inativação lógica do acesso).

### Rotas Web (Navegador)

- `GET /vitrine`: Exibição visual do catálogo completo.

- `GET /vitrine/:referencia`: Página com informações detalhadas de um produto específico.

- `GET /equipe`: Tabela visual de auditoria gerencial para consulta de contas.

- `GET /login` & `GET /register`: Telas renderizadas para autenticação baseada em Cookies HttpOnly.

## Características das Entidades

### Produtos

Para que um produto seja válido no sistema, ele deve possuir obrigatoriamente campos como nome, referência (única), categoria, tamanho, preço e estoque. Além disso, todo produto possui uma regra de auditoria: o sistema injeta e vincula automaticamente o username logado no campo `cadastradoPor` no momento da criação.

### Usuários e Controle de Acesso (RBAC)

Os usuários são definidos por nome, username (único), e-mail (único) e senha (salva como hash). O sistema utiliza um controle rigoroso de papéis (`cargo`):

- **Gerente:** Acesso total (Contratação, deleção de base, reposição direta).

- **Vendedor:** Acesso operacional de estoque (Cadastro de produtos e baixa por venda).

- **Estagiário/Cliente:** Acesso estrito apenas à leitura (Vitrine) e compras na interface Web.
  A autenticação Web é totalmente isolada contra roubos XSS utilizando `Cookies HttpOnly`.
