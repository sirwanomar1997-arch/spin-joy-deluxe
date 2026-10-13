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

## Application architecture
- Keep wheel geometry, release-velocity estimation, inertia, audio and local persistence in separate browser-safe wheel modules so geometry and physics can be tested independently.
- Use one pointer-driven requestAnimationFrame rotation owner; derive results from the same final rotation and fixed top pointer, never from a separate random selection.
- Keep the wheel library in a validated versioned local store shared by a root provider; only update committed UI state after a successful storage write to avoid false save confirmations.
- Use separate content routes for the wheel, editor, settings and library, with route-specific metadata and a shared visual shell.
