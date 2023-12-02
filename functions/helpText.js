export function helpText() {
  document.getElementById("help-area").innerHTML = `

    <div class="help">
      <p>This tool will create an anthology of suttas from Bhante Sujato's translations based on your instructions.</p>
      <h2>Including Suttas</h2>
      <p>You will need to use the exact sutta id found in the url when viewing the sutta you want on SuttaCentral.com. For example, to include the first chapter of the Dhammapada, look at the url:</p>
      <p>
        <code>https://suttacentral.net/<span class="highlight">dhp1-20</span>/en/sujato</code>
      </p>
      <p>The highlighted part, <code>dhp1-20</code> is what you have to use. Put one sutta ID on each line. You may find the <a href="https://sutta.readingfaithfully.org">Citation Helper</a> usefull for obtaining working citations.</p>
      <h2>Including custom text</h2>
      <p>There are three types of custom text that can be included: heading leve 1 (h1), heading level 2 (h2), and paragraph text (p). Here is an example of all three:</p>
      <pre>
h1 My great Anthology
h2 Section One
p These are my favorites
kp9
dhp1-20</pre
      >
      <h2>Ignoring Lines</h2>
      <p>All lines enclosed in parentheses will be ignored. You could use this for comments you want in the build instructions that won't be in the anthology.</p>
<details>
        <summary class="button-long">Advanced</summary>
        <div class="help nested-help">
        <h2>Settings</h2>
        <p>It is possible to customize the anthology by adding settings to the beginning of the instructions:</p>
        <pre>
{
"includeTableOfContents":true,
"suttaTitlesMarkup": "h3"
}</pre
        >
        </div>
        <h2>Ranges</h2>
        <p>You can include a single range of segments for each sutta by adding them after a colon on the same line as the sutt ID. You can show segment numbers on SuttaCentral by cliking on <code class="highlight">Views</code> <code> ></code> <code class="highlight">Refrences</code> <code> ></code> <code class="highlight">Main</code>. Most segment numbers are two numbers separated with decimals. For longer suttas, it is sometimes three. For example:</p>
        <pre>
DN 21:2.1.1-2.2.23
DN 15:9.1-9.2
AN 3.69:2.1-5.2</pre>
        <p>Some suttas are actually an aggregate of smaller suttas. We see this often in the early chapters of the AN and in the end of some chapters in the SN and AN. In order to include selected suttas, you must first find the ID of the complete group of suttas. For example, if you want to include <code class="highlight">an2.37</code> you must first find it on the page of <code class="highlight">an2.32-41</code> <a href="https://suttacentral.net/an2.32-41/en/sujato" rel="noreferrer" target="_blank">here.</a> </p>
        <p>Then you need to build the instruction by putting the main page ID first, followed by a <code class="highlight">></code> followed by the specific sutta you want, followed by the segment ranges. So your final instruction would be this:</p>
        <pre>
an2.32-41>an2.37:1.0-10.4</pre>
        </details>
        </div>

`;
}
