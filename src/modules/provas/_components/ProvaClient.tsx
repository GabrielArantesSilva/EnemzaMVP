"use client";

import { useState, useTransition } from "react";
import { Check, X } from "lucide-react";

import { cn } from "@/core/lib/utils";
import { Button } from "@/core/components/ui/button";
import { submeterProva } from "../provas.actions";
import type { ProvaParaResponder, ResultadoProva } from "../provas.types";

interface ProvaClientProps {
  prova: ProvaParaResponder;
}

export function ProvaClient({ prova }: ProvaClientProps) {
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [resultado, setResultado] = useState<ResultadoProva | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  const questaoAtual = prova.questoes[indice];
  const ultimaQuestao = indice === prova.questoes.length - 1;
  const respostaAtual = respostas[questaoAtual.id];

  function escolher(letra: string) {
    setRespostas((anterior) => ({ ...anterior, [questaoAtual.id]: letra }));
  }

  function avancar() {
    if (ultimaQuestao) {
      iniciarTransicao(async () => {
        const resultado = await submeterProva({ provaId: prova.id, respostas });
        setResultado(resultado);
      });
      return;
    }
    setIndice((atual) => atual + 1);
  }

  if (resultado) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl bg-primary p-5 text-center text-primary-foreground">
          <p className="font-display text-3xl font-extrabold">
            {resultado.acertos}/{resultado.total}
          </p>
          <p className="text-sm font-semibold opacity-80">acertos</p>
        </div>

        <div className="flex flex-col gap-2">
          {prova.questoes.map((questao, posicao) => {
            const item = resultado.detalhe.find((d) => d.questaoId === questao.id)!;
            return (
              <div
                key={questao.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                {item.correta ? (
                  <Check className="size-5 shrink-0 text-primary" strokeWidth={2.5} />
                ) : (
                  <X className="size-5 shrink-0 text-destructive" strokeWidth={2.5} />
                )}
                <p className="text-sm">
                  {posicao + 1}. {questao.enunciado}
                  {!item.correta && (
                    <span className="ml-1 font-semibold text-muted-foreground">
                      (gabarito: {item.gabarito})
                    </span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-semibold text-muted-foreground">
        Questão {indice + 1} de {prova.questoes.length}
      </p>

      <p className="font-display text-lg font-bold">{questaoAtual.enunciado}</p>

      <div className="flex flex-col gap-2">
        {questaoAtual.alternativas.map((alternativa) => (
          <button
            key={alternativa.letra}
            type="button"
            onClick={() => escolher(alternativa.letra)}
            className={cn(
              "rounded-xl border p-3 text-left text-sm font-medium",
              respostaAtual === alternativa.letra
                ? "border-primary bg-accent"
                : "border-border bg-card",
            )}
          >
            <span className="font-bold">{alternativa.letra})</span> {alternativa.texto}
          </button>
        ))}
      </div>

      <Button disabled={!respostaAtual || pendente} onClick={avancar}>
        {pendente ? "Corrigindo..." : ultimaQuestao ? "Finalizar prova" : "Próxima questão"}
      </Button>
    </div>
  );
}
