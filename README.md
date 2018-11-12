The following applications are a good example, of how I like to wrap my applications.
```
<aspnet-azure>    
    <signalR-service></signalR-service>   
    <sql-services></sql-services>
    <table-storage></table-storage>
   <wcf-services></wcf-services>
</aspnet-azure>
<aspnet-services>
    ## The repository for this later can be found:
    https://github.com/victorioferrario/Services
</aspnet-services>
<aspnet-site>  
  <asp-web-session>    
    <asp-web-api>
      <durandal-typescript-spa></durandal-typesrcipt-spa>
    </asp-web-api>
  </asp-web-session>
</aspnet-site>
```
Essentially its a three tier architecture, do to its layers. 
I would be more than happy to go into depth, sharing the structure of this application, and why we choose to develop it this way.


At the end of the day, the spa application works as follows:
```
spa => (c#) => webApi
  webApi => wcf services-layer 
    wcf => Business Logic
      sql-server
      twillio
      rxnt
      table-storage
```

# Portal
Asp.Net Application & TypeScript Application that make up the member portal.  The Members Application is the Asp.Net application that exposes an api to typescript that communicates to the WCF services.

To view the portal in action, please view <a href="https://www.youtube.com/watch?v=xr5rM_vVdyw&list=PLGHOdV5AK2dhFB7Q3pFarVOeNt9ZhYtX7" target="blank">Demos playlist</a> video captures I have uploaded to YouTube.com   

## Mobile  
<img src="https://github.com/vmfdesign/Portal/blob/master/MembersTSApp/02.png" />
<img src="https://github.com/vmfdesign/Portal/blob/master/MembersTSApp/01.png" />

## Desktop
<img src="https://github.com/vmfdesign/Portal/blob/master/MembersTSApp/Web.png" />


