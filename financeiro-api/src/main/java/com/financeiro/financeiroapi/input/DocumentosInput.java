package com.financeiro.financeiroapi.input;

import java.sql.Date;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import com.financeiro.financeiroapi.model.enums.TipoContato;
import com.financeiro.financeiroapi.model.enums.TipoDocumento;

import lombok.Data;

@Data
public class DocumentosInput {
	
	private Long id;
	
	@NotNull
	private TipoDocumento tipoDocumento;
	
	@Valid
	@NotNull
	private Long pessoa;
	
	@NotNull
	private String numeroDocumento;
	
	private Date data_documento; 
	private Date data_expedicao; 
	private Date data_validade;

}
