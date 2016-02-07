<%@ Page Title="Home Page" Async="true" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Members._Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ApplicationContentArea" runat="server"></asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ApplicationStartUpScripts" runat="server">
    <script id="jsonPayload" type="application/json"><%= Payload %></script>
    <script src="Scripts/require/require.js" data-main="App/main"></script>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ApplicationTemplateScripts" runat="server">
    <script>
        console.log(document.location.host);
    </script>
</asp:Content>