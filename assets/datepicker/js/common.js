$(function() {
	$(window).bind('load', function() {
	    SyntaxHighlighter.all();		SyntaxHighlighter.autoloader (
			 "bash                  lib/syntaxhighlighter_3.0.83/scripts/shBrushBash.js"
			,"css                   lib/syntaxhighlighter_3.0.83/scripts/shBrushCss.js"
			,"php                   lib/syntaxhighlighter_3.0.83/scripts/shBrushPhp.js"
			,"diff                  lib/syntaxhighlighter_3.0.83/scripts/shBrushDiff.js"
			,"html xml xhtml        lib/syntaxhighlighter_3.0.83/scripts/shBrushXml.js"
			,"js jscript javascript lib/syntaxhighlighter_3.0.83/scripts/shBrushJScript.js"
			,"perl pl               lib/syntaxhighlighter_3.0.83/scripts/shBrushPerl.js"
			,"plain                 lib/syntaxhighlighter_3.0.83/scripts/shBrushPlain.js"
			,"python py             lib/syntaxhighlighter_3.0.83/scripts/shBrushPython.js"
			,"sql                   lib/syntaxhighlighter_3.0.83/scripts/shBrushSql.js"
			,"tt tt2                lib/syntaxhighlighter_3.0.83/scripts/shBrushTT2.js"
			,"yaml yml              lib/syntaxhighlighter_3.0.83/scripts/shBrushYAML.js"
		);
//		SyntaxHighlighter.config.bloggerMode=true;
		SyntaxHighlighter.all();
	});
});