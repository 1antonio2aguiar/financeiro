package com.financeiro.financeiroapi.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.financeiro.financeiroapi.DTO.CorrespondenciasDTO;
import com.financeiro.financeiroapi.assembler.CorrespondenciasAssembler;
import com.financeiro.financeiroapi.input.CorrespondenciasInput;
import com.financeiro.financeiroapi.model.Correspondencias;
import com.financeiro.financeiroapi.model.Enderecos;
import com.financeiro.financeiroapi.service.CorrespondenciasService;
import com.financeiro.financeiroapi.service.EnderecosService;

@RestController
@RequestMapping("/enderecos/{enderecoId}/correspondencias")
public class CorrespondenciasControler {
	
	@Autowired private CorrespondenciasService correspondenciasService; 
	@Autowired private CorrespondenciasAssembler correspondenciasAssembler;
	@Autowired private EnderecosService enderecosService;
	
	/*@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public CorrespondenciasDTO registrar(@PathVariable Long enderecoId, @Valid @RequestBody CorrespondenciasInput correspondenciasInput) {
		
		Correspondencias CorrespondenciaRegis = correspondenciasService.registrar(enderecoId, correspondenciasInput.getDescricao());
		
		return correspondenciasAssembler.toModel(CorrespondenciaRegis);  
		
	}*/
	
	/*@GetMapping
	public List<CorrespondenciasDTO> listar(@PathVariable Long enderecoId) {
		
		Enderecos enderecos = enderecosService.buscar(enderecoId);
		
		return correspondenciasAssembler.toCollectionDTO(enderecos.getCorrespondencias());
		
	}*/
	                   
}
