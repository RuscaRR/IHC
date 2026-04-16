const {
  loginUsuario,
  criarEventoIdade,
  defineCapacidade,
  nomeEvento
} = require('./funcoes');

// Função exemplo para dataEvento
function dataEvento(data) {
  const hoje = new Date();
  hoje.setHours(0,0,0,0);
  
  if (data < hoje) return "Erro";
  return "Sucesso";
}

describe("Teste de Valor Limite", () => {

  test("loginUsuario limites", () => {
    expect(loginUsuario("12345")).toBe("Erro");       // 5
    expect(loginUsuario("123456")).toBe("Sucesso");   // 6
    expect(loginUsuario("a".repeat(50))).toBe("Sucesso"); // 50
    expect(loginUsuario("a".repeat(51))).toBe("Erro");    // 51
  });

  test("criarEventoIdade limites", () => {
    expect(criarEventoIdade(17)).toBe("Erro");
    expect(criarEventoIdade(18)).toBe("Sucesso");
    expect(criarEventoIdade(100)).toBe("Sucesso");
    expect(criarEventoIdade(101)).toBe("Erro");
  });

  test("defineCapacidade limites", () => {
    expect(defineCapacidade(0)).toBe("Erro");
    expect(defineCapacidade(1)).toBe("Sucesso");
    expect(defineCapacidade(1000)).toBe("Sucesso");
    expect(defineCapacidade(1001)).toBe("Erro");
  });

  test("dataEvento limites", () => {
    const hoje = new Date();

    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);

    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);

    expect(dataEvento(ontem)).toBe("Erro");
    expect(dataEvento(hoje)).toBe("Sucesso");
    expect(dataEvento(amanha)).toBe("Sucesso");
  });

  test("nomeEvento limites", () => {
    expect(nomeEvento("")).toBe("Erro");               // 0
    expect(nomeEvento("A")).toBe("Sucesso");           // 1
    expect(nomeEvento("a".repeat(100))).toBe("Sucesso"); // 100
    expect(nomeEvento("a".repeat(101))).toBe("Erro");    // 101
  });

});

// Simulações simples
function loginUsuarioEq(email, senha) {
  if (!email.includes("@")) return "Erro";
  if (senha !== "123456") return "Erro";
  return "Sucesso";
}

function criarEvento(nome, data) {
  if (!nome) return "Erro";
  if (!data || isNaN(new Date(data))) return "Erro";
  return "Sucesso";
}

function marcarInteresse(usuario, evento, jaExiste) {
  if (!evento) return "Erro";
  if (jaExiste) return "Erro";
  return "Sucesso";
}

function cancelarInteresse(existe) {
  return existe ? "Sucesso" : "Erro";
}

function listarEventos(filtro) {
  if (filtro === "invalido") return "Erro";
  if (filtro === "vazio") return [];
  return ["evento1", "evento2"];
}

describe("Teste por Classes de Equivalência", () => {

  test("loginUsuario equivalência", () => {
    expect(loginUsuarioEq("user@email.com", "123456")).toBe("Sucesso");
    expect(loginUsuarioEq("user@email.com", "errada")).toBe("Erro");
    expect(loginUsuarioEq("emailinvalido", "123456")).toBe("Erro");
  });

  test("criarEvento equivalência", () => {
    expect(criarEvento("Festa", "2026-01-01")).toBe("Sucesso");
    expect(criarEvento("", "2026-01-01")).toBe("Erro");
    expect(criarEvento("Festa", "data-invalida")).toBe("Erro");
  });

  test("marcarInteresse equivalência", () => {
    expect(marcarInteresse("user", "evento", false)).toBe("Sucesso");
    expect(marcarInteresse("user", "evento", true)).toBe("Erro");
    expect(marcarInteresse("user", null, false)).toBe("Erro");
  });

  test("cancelarInteresse equivalência", () => {
    expect(cancelarInteresse(true)).toBe("Sucesso");
    expect(cancelarInteresse(false)).toBe("Erro");
  });

  test("listarEventos equivalência", () => {
    expect(listarEventos("valido")).toEqual(["evento1", "evento2"]);
    expect(listarEventos("vazio")).toEqual([]);
    expect(listarEventos("invalido")).toBe("Erro");
  });

});