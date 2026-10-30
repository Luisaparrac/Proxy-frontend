import { useState } from 'react';
import { tokenEstimator } from '../../services/TokenEstimator';
import { formatNumber, formatSeconds } from '../../utils/format';

const MAX_PROMPT_LENGTH = 4000;

const buttonLabel = (block) => {
  if (!block) return 'Enviar';
  if (block.type === 'sending') return 'Generando…';
  if (block.type === 'rate') return `Espera ${formatSeconds(block.seconds)}`;
  if (block.type === 'quota') return 'Sin tokens';
  return 'Enviar';
};

/**
 * Prompt input with the token estimator. The send button is disabled while
 * rate limited (with countdown), while sending, or when the quota is exhausted.
 */
export function PromptComposer({ onSend, block, remainingTokens, onUpgrade, canUpgrade }) {
  const [prompt, setPrompt] = useState('');
  const estimate = tokenEstimator.estimateTotal(prompt);
  const isBlocked = Boolean(block);
  const canSubmit = !isBlocked && prompt.trim().length > 0;
  const mayExceedQuota = remainingTokens != null && estimate.total > remainingTokens;

  const submit = () => {
    if (!canSubmit) return;
    onSend(prompt.trim());
    setPrompt('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      className="composer"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      {block?.type === 'rate' && (
        <p className="composer__banner composer__banner--rate" role="status">
          Alcanzaste el límite de solicitudes por minuto. Podrás enviar de nuevo en {formatSeconds(block.seconds)}.
        </p>
      )}
      {block?.type === 'quota' && (
        <p className="composer__banner composer__banner--quota" role="status">
          Agotaste los tokens de este mes.
          {canUpgrade && (
            <button type="button" className="link-button" onClick={onUpgrade}>Mejorar a PRO</button>
          )}
        </p>
      )}

      <div className="composer__box">
        <label htmlFor="prompt" className="visually-hidden">Prompt</label>
        <textarea
          id="prompt"
          className="composer__input"
          rows={2}
          maxLength={MAX_PROMPT_LENGTH}
          placeholder="Pregúntale algo a la IA…"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className="button button--send" disabled={!canSubmit}>
          {buttonLabel(block)}
        </button>
      </div>

      <div className="composer__estimate" aria-live="polite">
        {estimate.total > 0 ? (
          <>
            Consumo estimado: <strong>≈ {formatNumber(estimate.total)} tokens</strong>
            {' '}({formatNumber(estimate.promptTokens)} del prompt + ~{estimate.responseTokens} de la respuesta)
            {mayExceedQuota && <span className="composer__warning"> Puede que no te alcancen los tokens.</span>}
          </>
        ) : (
          'Escribe para ver cuántos tokens consumirá tu prompt. Enter envía, Shift + Enter hace un salto de línea.'
        )}
      </div>
    </form>
  );
}
