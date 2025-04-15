// src/quill-config.js
import Quill from 'quill';
import hljs from 'highlight.js/lib/core';

import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);

window.hljs = hljs; // Must be on window before importing Quill modules using it

// Optional: Patch Quill code block if needed
const CodeBlock = Quill.import('formats/code-block');
CodeBlock.className = 'ql-syntax';
CodeBlock.tagName = 'PRE';
CodeBlock.blotName = 'code-block';
Quill.register(CodeBlock, true);

export default Quill;
