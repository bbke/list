---
<%@ page import="java.io.*" %>
<HTML>
    <HEAD>
        <TITLE>Index of Files</TITLE>
    </HEAD>
    <BODY>
        <H1>Index of Files</H1>
        Click a file to open/download it...
        <%
            String file = application.getRealPath("/");
            File file1 = new File(file);
            String [] fileNames = file1.list();
            File [] fileObjects= file1.listFiles();
        %>
        <UL>
        <%
            for (int i = 0; i < fileObjects.length; i++) {
                if(!fileObjects[i].isDirectory()){
        %>
        <LI>
          <A HREF="<%= fileNames[i] %>"><%= fileNames[i] %></A>
          &nbsp;&nbsp;&nbsp;&nbsp;
          (<%= Long.toString(fileObjects[i].length()) %> bytes long)
        <%
                }
            }
        %>
        </UL>
    </BODY>
</HTML>
---