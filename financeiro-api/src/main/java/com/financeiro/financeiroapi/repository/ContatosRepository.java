package com.financeiro.financeiroapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.financeiro.financeiroapi.model.Contatos;
import com.financeiro.financeiroapi.repository.contatos.ContatosRepositoryQuery;

@Repository
public interface ContatosRepository extends JpaRepository<Contatos, Long>, ContatosRepositoryQuery{

}
