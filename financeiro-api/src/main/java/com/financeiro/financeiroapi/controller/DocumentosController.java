package com.financeiro.financeiroapi.controller;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
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

import com.financeiro.financeiroapi.filter.DocumentosFilter;
import com.financeiro.financeiroapi.input.DocumentosInput;
import com.financeiro.financeiroapi.model.Documentos;
import com.financeiro.financeiroapi.repository.DocumentosRepository;
import com.financeiro.financeiroapi.service.DocumentosService;

@RestController
@RequestMapping("/documentos")
public class DocumentosController {
	
	@Autowired private DocumentosService documentosService;
	@Autowired private DocumentosRepository documentosRepository;
	
	// Lista de endereços com Paginacao
	@GetMapping
	public Page<Documentos> pesquisar(DocumentosFilter documentosFilter, Pageable pageable) {
	    return documentosRepository.filtrar(documentosFilter, pageable);
	}
	
	// AA - Inserir
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Documentos> adicionar(@Valid @RequestBody DocumentosInput documentosInput, HttpServletResponse response) {
		
		Documentos documentosSalva = documentosService.save(documentosInput);
		return ResponseEntity.status(HttpStatus.CREATED).body(documentosSalva);
		
	}
	
	// Alterar
	@PutMapping("/{id}")
	public ResponseEntity<Documentos> atualizar(@PathVariable Long id, @Validated @RequestBody DocumentosInput documentosInput) {
		Documentos documentosSalva = documentosService.atualizar(id, documentosInput);
		return ResponseEntity.ok(documentosSalva);
	}
	
	// Deletar
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> excluir(@PathVariable Long id){
		
		if(!documentosRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		
		documentosService.excluir(id);
		return ResponseEntity.noContent().build();		
		
	}	
}
