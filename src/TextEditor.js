import React, {useEffect, useRef, useState} from "react";

import config from "./config";
import "./styles/styles.scss";
import Toolbar from "./Toolbar";

const TextEditor = props => {

    const editor = useRef();

    const [content, setContent] = useState("");
    const [showSourceCode, toggleShowSourceCode] = useState(false);
    const [showEmoticonBox, toggleShowEmoticonBox] = useState(false);
    const [sourceCode, setSourceCode] = useState("");

    // Assign event handlers
    useEffect(() => {
        editor.current.addEventListener("paste", pasteHandler, false);
        editor.current.addEventListener("focus", placeHolderHide, false);
        editor.current.addEventListener("blur", placeHolderShow, false);

        return () => {
            editor.current.removeEventListener("paste", pasteHandler, false);
            editor.current.removeEventListener("focus", placeHolderHide, false);
            editor.current.removeEventListener("blur", placeHolderShow, false);
        }
    }, []);

    useEffect(() => {
       props.onChange(content);
    }, [content]);

    // Placeholder toggle handler
    let placeholder;

    const placeHolderHide = () => {
        placeholder = editor.current.getAttribute("data-placeholder");
        editor.current.setAttribute("data-placeholder", "");
    };

    const placeHolderShow = () => {
        editor.current.setAttribute("data-placeholder", placeholder);
    };

    //Paste handler
    const pasteHandler = event => {
        event.preventDefault();
        const text = event.clipboardData.getData("text");
        document.execCommand("insertText", false, text);
    };

    const handleToolbarClick = toolbarButton => {
        let selection = document.getSelection();
        let text = selection.toString() ? selection.toString() : "&#8203;"; // &#8203; = invisible space
        let url = "";


        editor.current.focus();

        switch (toolbarButton) {
            case "bold":
                return document.execCommand("bold", false, null);
            case "italic":
                return document.execCommand("italic", false, null);
            case "underline":
                return document.execCommand("underline", false, null);
            case "strikethrough":
                return document.execCommand("strikethrough", false, null);
            case "header1":
                return document.execCommand("insertHTML", false, `<h1>${text}</h1>`);
            case "header2":
                return document.execCommand("insertHTML", false, `<h2>${text}</h2>`);
            case "quote":
                return document.execCommand("insertHTML", false, `<blockquote>${text}</blockquote>`);
            case "code":
                return document.execCommand("insertHTML", false, `<pre>${text}</pre>`);
            case "horizontalRule":
                return document.execCommand("insertHorizontalRule", false, null);
            case "listUnordered":
                return document.execCommand("insertUnorderedList", false, null);
            case "listOrdered":
                return document.execCommand("insertOrderedList", false, null);
            case "alignLeft":
                return document.execCommand("justifyLeft", false, null);
            case "alignCenter":
                return document.execCommand("justifyCenter", false, null);
            case "alignRight":
                return document.execCommand("justifyRight", false, null);
            case "alignJustify":
                return document.execCommand("justifyFull", false, null);
            case "indent":
                return document.execCommand("indent", false, null);
            case "outdent":
                return document.execCommand("outdent", false, null);
            case "link":
                url = prompt("Enter your URL:", "https://");
                text = selection.toString() ? selection.toString() : url;

                if (url === null || url === "" || url === "http://" || url === "https://") {
                    return;
                }

                return document.execCommand("insertHTML", false, `<a href='${url}'>${text}</a>`);
            case "image":
                url = prompt("Enter Image URL:", "https://");

                if (url === null || url === "" || url === "http://" || url === "https://") {
                    return;
                }

                return document.execCommand("insertHTML", false,
                    `<div class="text-editor__image__box"><img src="${url}" alt="" /></div>`
                );
            case "formatClear":
                return document.execCommand("removeFormat", false, null);
            case "emoticon":
                return toggleShowEmoticonBox(prevState => !prevState);
            case "source":
                return toggleShowSourceCode(prevState => !prevState);
            default:
                return console.log(toolbarButton + " is not a supported button");
        }
    };

    const onEmoticonClick = emoticon => {
        editor.current.focus();
        toggleShowEmoticonBox(false);

        document.execCommand("insertHTML", false,
            `<img src="${config.emoticons.imgRoot}${emoticon}.svg" class="text-editor__box__emoticon" alt="" />`);
    };

    const handleChange = () => {
        setContent(editor.current.innerHTML);
        setSourceCode(editor.current.innerHTML);
    };

    return (
        <div className="text-editor">
            <Toolbar
                config={config}
                onClick={(toolbarButton) => handleToolbarClick(toolbarButton)}
                showEmoticonBox={showEmoticonBox}
                toggleShowEmoticonBox={() => toggleShowEmoticonBox(prevState => !prevState)}
                onEmoticonClick={emoticon => onEmoticonClick(emoticon)}
            />
            <div className="text-editor__box" data-placeholder="Your text..." contentEditable="true"
                 onInput={handleChange} ref={editor}>
            </div>
            {showSourceCode && <div className="text-editor__code-heading">Source code</div>}
            {showSourceCode && <div className="text-editor__code">{sourceCode}</div>}
            <div className="text-editor__status u-margin-bottom-small" />
        </div>
    );
};

TextEditor.defaultProps = {
    onChange: () => {}
};

export default TextEditor;