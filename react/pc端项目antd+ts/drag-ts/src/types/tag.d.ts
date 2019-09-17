import { type } from "os";

export interface IChildProps {
    value?: string;
    tagName?: HTMLElementTagNameMap;
    style?: styleObj;
    event?: eventObj;
    ComName?: string;
    iconType: string;
}




type HTMLElementTagNameMap = "a" | "abbr" | "address" | "applet" | "area" | "article" | "aside" | "audio" | "b" | "base" | "basefont" | "bdi" | "bdo" | "blockquote" | "body" | "br" | "button" | "canvas" | "caption" | "cite" | "code" | "col" | "colgroup" | "data" | "datalist" | "dd" | "del" | "details" | "dfn" | "dialog" | "dir" | "div" | "dl" | "dt" | "em" | "embed" | "fieldset" | "figcaption" | "figure" | "font" | "footer" | "form" | "frame" | "frameset" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "head" | "header" | "hgroup" | "hr" | "html" | "i" | "iframe" | "img" | "input" | "ins" | "kbd" | "label" | "legend" | "li" | "link" | "main" | "map" | "mark" | "marquee" | "menu" | "meta" | "meter" | "nav" | "noscript" | "object" | "ol" | "optgroup" | "option" | "output" | "p" | "param" | "picture" | "pre" | "progress" | "q" | "rp" | "rt" | "ruby" | "s" | "samp" | "script" | "section" | "select" | "slot" | "small" | "source" | "span" | "strong" | "style" | "sub" | "summary" | "sup" | "table" | "tbody" | "td" | "template" | "textarea" | "tfoot" | "th" | "thead" | "time" | "title" | "tr" | "track" | "u" | "ul" | "var" | "video" | "wbr"



interface styleObj {
    backgroundColor?: string;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'underline' | 'none';
    textAlign?: 'left' | 'center' | 'right';
    margin?: string;
    color?: string;
    fontSize?: string;
    width?: string;
    height?: string;
    borderStyle?: 'none' | 'dotted' | 'dashed' | 'solid';
    borderColor?: string;
    borderWidth?: string;
    boxShadow?: string;
    borderRadius?: string;
}

enum eventType {
    none,
    page,
    api,
}

interface eventObj {
    type?: eventType.none | eventType.page | eventType.api, // 1.无事件 2. 页面跳转 3.api
    value?: string,
    remark?: any,
}