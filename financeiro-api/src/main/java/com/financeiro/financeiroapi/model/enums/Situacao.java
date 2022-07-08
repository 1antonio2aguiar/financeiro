package com.financeiro.financeiroapi.model.enums;

public enum Situacao {
	
	A("ATIVO"),
	I("INATIVO"),
	P("PARALISADO"),
	S("SUSPENSO");
	
	private String descricao;

	Situacao(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

}
