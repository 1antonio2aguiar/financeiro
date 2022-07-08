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

import com.financeiro.financeiroapi.filter.PessoasFilter;
import com.financeiro.financeiroapi.input.BairrosInput;
import com.financeiro.financeiroapi.input.PessoasInput;
import com.financeiro.financeiroapi.model.Bairros;
import com.financeiro.financeiroapi.model.Pessoas;
import com.financeiro.financeiroapi.repository.PessoasRepository;
import com.financeiro.financeiroapi.service.PessoasService;

@RestController
@RequestMapping("/pessoas")
public class PessoasController {
	
	@Autowired public PessoasService pessoasService;
	@Autowired public PessoasRepository pessoasRepository;
	
	// Lista de pessoas com Paginacao
	@GetMapping
	public Page<Pessoas> pesquisar(PessoasFilter pessoasFilter, Pageable pageable) {
	    return pessoasRepository.filtrar(pessoasFilter, pageable);
	}
	
	// AA - Inserir
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Pessoas> adicionar(@Valid @RequestBody PessoasInput pessoasInput, HttpServletResponse response) {
		Pessoas pessoasSalva = pessoasService.save(pessoasInput);
		return ResponseEntity.status(HttpStatus.CREATED).body(pessoasSalva);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Pessoas> BuscarPorId(@PathVariable Long id) {
		System.err.println("Entrou aqui ");
		return pessoasRepository.findById(id)
				.map(pessoas -> ResponseEntity.ok(pessoas))
				.orElse(ResponseEntity.notFound().build());
		
		// OU
		
		//Optional<Pessoas> pessoas = pessoasRepository.findById(id);
		//if(pessoas.isPresent()) {
		//	return ResponseEntity.ok(pessoas.get());
		//} 
		//return ResponseEntity.notFound().build();
 		
	}
	
	// Alterar
	@PutMapping("/{id}")
	public ResponseEntity<Pessoas> atualizar(@PathVariable Long id, @Validated @RequestBody PessoasInput pessoasInput) {
		Pessoas pessoasSalva = pessoasService.atualizar(id, pessoasInput);
		return ResponseEntity.ok(pessoasSalva);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> excluir(@PathVariable Long id){
		
		if(!pessoasRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		
		pessoasService.excluir(id);
		return ResponseEntity.noContent().build();		
		
	}
	
}
