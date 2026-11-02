<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the birthday date calculations in the browser-safe birthday utility, using visitor-local midnight; SSR renders neutral countdown placeholders to prevent hydration mismatches.
- Keep supplied personal letter and memory messages in the story data module; presentation and interactive states remain in the existing index route.
- Use the existing design-system Button for story interactions, with semantic global CSS tokens and reduced-motion alternatives.
- Keep gesture-triggered birthday audio lifecycle in the browser-safe audio utility, with a hard playback cutoff and cleanup; share lantern release between the candle action and the existing lantern control so both animate actual interactions.
