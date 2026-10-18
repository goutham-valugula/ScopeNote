# ScopeNote

**Make the extra work clear before it starts.** ScopeNote is a small, private tool for freelancers who need to discuss a new client request without turning it into an awkward conversation.

Describe the original scope and the new ask. Then choose whether to price it as an addition, trade it for something already included, or revisit it later. ScopeNote prepares a client-ready note with the cost and schedule impact where relevant. Copy it or print/save it as a PDF.

## Why this exists

Freelancers describe losing real time and money when small additions accumulate. In one recent discussion, a freelancer estimated that unpriced requests added 23 hours and $2,300 to a single project. A Scottish creative-industry survey also found that 59% of respondents had experienced unclear or unreasonable expectations in freelance work. These are signals of a recurring problem, not proof of demand for this particular tool.

Scope-change generators and full freelancer platforms already exist, so this is not presented as a new category. ScopeNote is a deliberately small, no-account, browser-only conversation aid with three practical paths: add the request for a fee, trade it against included work, or defer it. Whether this particular version is useful enough to adopt still needs real-user feedback. It does not replace a contract, project manager, invoicing app, or legal adviser.

## Use it

Open `index.html` in a modern browser, or serve this folder with any static web server. No build step or account is needed.

1. Add the project and client details.
2. Describe what was included and what changed.
3. Choose **Add to the project**, **Swap something out**, or **Plan it for later**.
4. Review the note, then copy it or use Print / Save as PDF.

Drafts are saved to this browser's local storage. Nothing is uploaded or sent. Avoid entering confidential client information on a shared device. Use the reset button to clear the saved draft.

## Notes

- The generated wording is a communication aid, not legal advice or a contract amendment.
- Review and adapt the wording before sending it.
- A client note does not replace the terms of an existing agreement.
- This prototype has no account, analytics, backend, or external API.

## Development

The app is plain HTML, CSS, and JavaScript. To serve locally, run for example:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Evidence and further reading

- [Freelancer discussion: losing $2,300 to scope creep](https://www.reddit.com/r/freelance/comments/1ozc3zq/lost_2300_to_scope_creep_on_one_project_how_do/) — an individual account and community advice, not a representative survey.
- [Freelance and Forgotten: worker exploitation in Scotland’s creative industries](https://www.stuc.org.uk/resources/freelance-and-forgotten-a-report-on-worker-exploitation-in-scotlands-creative-industries.pdf) — survey report; its findings apply to the report’s respondents and sector.

## License

MIT. See [LICENSE](LICENSE).
