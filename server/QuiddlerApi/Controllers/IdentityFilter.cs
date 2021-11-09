using Microsoft.AspNetCore.Mvc.Filters;

namespace QuiddlerApi.Controllers;

public class IdentityFilter : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var userIdentity = (UserIdentity) context.HttpContext.RequestServices.GetService(typeof(UserIdentity));
        userIdentity.Name = context.HttpContext.User?.Claims?.SingleOrDefault(p => p.Type == "name")?.Value;
    }
}

public class UserIdentity
{
    public string Name { get; set; }
}