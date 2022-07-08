package com.financeiro.financeiroapi.controller;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.financeiro.financeiroapi.filter.ContatosFilter;
import com.financeiro.financeiroapi.input.ContatosInput;
import com.financeiro.financeiroapi.model.Contatos;
import com.financeiro.financeiroapi.repository.ContatosRepository;
import com.financeiro.financeiroapi.service.ContatosService;

@RestController
@RequestMapping("/contatos")
public class ContatosController {
	
	@Autowired private ContatosService contatosService;
	@Autowired private ContatosRepository contatosRepository;
	
	// Lista de endereços com Paginacao
	@GetMapping
	public Page<Contatos> pesquisar(ContatosFilter contatosFilter, Pageable pageable) {
	    return contatosRepository.filtrar(contatosFilter, pageable);
	}
	
	// AA - Inserir
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Contatos> adicionar(@Valid @RequestBody ContatosInput contatosInput, HttpServletResponse response) {
		
		Contatos contatosSalva = contatosService.save(contatosInput);
		return ResponseEntity.status(HttpStatus.CREATED).body(contatosSalva);
		
	}
	
	// Alterar
	@PutMapping("/{id}")
	public ResponseEntity<Contatos> atualizar(@PathVariable Long id, @Validated @RequestBody ContatosInput contatosInput) {
		Contatos contatosSalva = contatosService.atualizar(id, contatosInput);
		return ResponseEntity.ok(contatosSalva);
	}
	
	// Deletar
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> excluir(@PathVariable Long id){
		
		if(!contatosRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		
		contatosService.excluir(id);
		return ResponseEntity.noContent().build();		
		
	}

}
