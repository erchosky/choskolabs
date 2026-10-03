# LAB_STANDARD

Un laboratorio **no está terminado** hasta cumplir toda esta checklist. Aplícala a cada nivel nuevo.

## Diseño del reto
- [ ] Tiene un escenario realista y reconocible (no abstracto).
- [ ] Tiene una misión comprensible sin conocer la técnica.
- [ ] No spoilea la solución (no nombra la vulnerabilidad antes de resolverla).
- [ ] Deja una idea mental clara (`mentalModel`).
- [ ] Se puede resolver (verificado).
- [ ] La flag funciona (validación server-side).
- [ ] No requiere conocimiento previo que no se haya enseñado ya.
- [ ] Es divertido/interesante; no parece un ejercicio escolar artificial.

## Sistema de ayuda
- [ ] Pista 1 hace pensar (no dice dónde hacer clic).
- [ ] Pista 2 orienta (dime dónde mirar).
- [ ] Pista 3 ayuda técnicamente (instrucciones concretas).
- [ ] "Estoy totalmente perdido" enseña el concepto necesario, no solo la respuesta.
- [ ] La solución completa explica el razonamiento (nunca "pon 1843").

## Post-lab
- [ ] Explica qué hiciste (lenguaje sencillo).
- [ ] Explica por qué funcionó (causal).
- [ ] Explica cómo funcionaba la aplicación (cliente/servidor/petición/respuesta/permisos).
- [ ] Da el nombre técnico (después, no antes).
- [ ] Explica para qué sirve el conocimiento.
- [ ] Da ejemplos reales/cotidianos.
- [ ] Explica cómo detectarlo otra vez.
- [ ] Explica la mitigación (cómo lo arreglaría un desarrollador).
- [ ] Tiene un takeaway (idea para recordar).
- [ ] Ofrece tres profundidades: entiéndelo / técnicamente / profundiza.
- [ ] (Opcional) micro-pregunta de comprensión.

## Seguridad y aislamiento
- [ ] No afecta al portal ChoskoLabs.
- [ ] No interactúa con terceros ni servicios externos.
- [ ] El fallo es controlado (sin RCE real, filesystem real, SSRF real, SQLi sobre datos importantes).
- [ ] La flag no se filtra al bundle/props cliente salvo que ESE sea el objetivo del nivel.

## Código
- [ ] Definición en `src/content/labs/<id>.ts`, registrada en `curriculum.ts`.
- [ ] Escenario/lógica server-only en `src/scenarios/<marca>/`.
- [ ] Flag en `src/server/flags.ts`.
- [ ] Reutiliza componentes (`LabExperience`, `PostLab`, `HintSystem`, `LabFrame`, ...).
- [ ] Pasa `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build`.
