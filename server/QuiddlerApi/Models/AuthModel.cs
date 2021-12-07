// ReSharper disable CommentTypo
// ReSharper disable UnusedMember.Global

using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace QuiddlerApi.Models;

public record UserModel
{
    public string Name { get; init; }
    public string Email { get; init; }
}

public class UserView
{
    // ReSharper disable once InconsistentNaming
    public string tokenId { get; set; }
}

/// <summary>
/// The payload as specified in 
/// https://developers.google.com/accounts/docs/OAuth2ServiceAccount#formingclaimset,
/// https://developers.google.com/identity/protocols/OpenIDConnect, and
/// https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
/// </summary>
public class GoogleJsonWebSignaturePayload
{
    /// <summary>
    /// A space-delimited list of the permissions the application requests or <c>null</c>.
    /// </summary>
    [JsonPropertyName("scope")]
    public string Scope { get; set; }

    /// <summary>
    /// The email address of the user for which the application is requesting delegated access.
    /// </summary>
    [JsonPropertyName("prn")]
    public string Prn { get; set; }

    /// <summary>
    /// The hosted GSuite domain of the user. Provided only if the user belongs to a hosted domain.
    /// </summary>
    [JsonPropertyName("hd")]
    public string HostedDomain { get; set; }

    /// <summary>
    /// The user's email address. This may not be unique and is not suitable for use as a primary key.
    /// Provided only if your scope included the string "email".
    /// </summary>
    [JsonPropertyName("email")]
    public string Email { get; set; }

    /// <summary>
    /// True if the user's e-mail address has been verified; otherwise false.
    /// </summary>
    [JsonPropertyName("email_verified")]
    public bool EmailVerified { get; set; }

    /// <summary>
    /// The user's full name, in a displayable form. Might be provided when:
    /// (1) The request scope included the string "profile"; or
    /// (2) The ID token is returned from a token refresh.
    /// When name claims are present, you can use them to update your app's user records.
    /// Note that this claim is never guaranteed to be present.
    /// </summary>
    [JsonPropertyName("name")]
    public string Name { get; set; }

    /// <summary>
    /// Given name(s) or first name(s) of the End-User. Note that in some cultures, people can have multiple given names;
    /// all can be present, with the names being separated by space characters.
    /// </summary>
    [JsonPropertyName("given_name")]
    public string GivenName { get; set; }

    /// <summary>
    /// Surname(s) or last name(s) of the End-User. Note that in some cultures,
    /// people can have multiple family names or no family name;
    /// all can be present, with the names being separated by space characters.
    /// </summary>
    [JsonPropertyName("family_name")]
    public string FamilyName { get; set; }

    /// <summary>
    /// The URL of the user's profile picture. Might be provided when:
    /// (1) The request scope included the string "profile"; or
    /// (2) The ID token is returned from a token refresh.
    /// When picture claims are present, you can use them to update your app's user records.
    /// Note that this claim is never guaranteed to be present.
    /// </summary>
    [JsonPropertyName("picture")]
    public string Picture { get; set; }

    /// <summary>
    /// End-User's locale, represented as a BCP47 [RFC5646] language tag.
    /// This is typically an ISO 639-1 Alpha-2 [ISO639‑1] language code in lowercase and an
    /// ISO 3166-1 Alpha-2 [ISO3166‑1] country code in uppercase, separated by a dash.
    /// For example, en-US or fr-CA.
    /// </summary>
    [JsonPropertyName("locale")]
    public string Locale { get; set; }
}

[SuppressMessage("ReSharper", "InconsistentNaming")]
public class GoogleApiTokenInfo
{
    /// <summary>
    /// The Issuer Identifier for the Issuer of the response. Always https://accounts.google.com or accounts.google.com for Google ID tokens.
    /// </summary>
    public string iss { get; set; }

    /// <summary>
    /// Access token hash. Provides validation that the access token is tied to the identity token. If the ID token is issued with an access token in the server flow, this is always
    /// included. This can be used as an alternate mechanism to protect against cross-site request forgery attacks, but if you follow Step 1 and Step 3 it is not necessary to verify the 
    /// access token.
    /// </summary>
    public string at_hash { get; set; }

    /// <summary>
    /// Identifies the audience that this ID token is intended for. It must be one of the OAuth 2.0 client IDs of your application.
    /// </summary>
    public string aud { get; set; }

    /// <summary>
    /// An identifier for the user, unique among all Google accounts and never reused. A Google account can have multiple emails at different points in time, but the sub value is never
    /// changed. Use sub within your application as the unique-identifier key for the user.
    /// </summary>
    public string sub { get; set; }

    /// <summary>
    /// True if the user's e-mail address has been verified; otherwise false.
    /// </summary>
    public string email_verified { get; set; }

    /// <summary>
    /// The client_id of the authorized presenter. This claim is only needed when the party requesting the ID token is not the same as the audience of the ID token. This may be the
    /// case at Google for hybrid apps where a web application and Android app have a different client_id but share the same project.
    /// </summary>
    public string azp { get; set; }

    /// <summary>
    /// The user's email address. This may not be unique and is not suitable for use as a primary key. Provided only if your scope included the string "email".
    /// </summary>
    public string email { get; set; }

    /// <summary>
    /// The time the ID token was issued, represented in Unix time (integer seconds).
    /// </summary>
    public string iat { get; set; }

    /// <summary>
    /// The time the ID token expires, represented in Unix time (integer seconds).
    /// </summary>
    public string exp { get; set; }

    /// <summary>
    /// The user's full name, in a displayable form. Might be provided when:
    /// The request scope included the string "profile"
    /// The ID token is returned from a token refresh
    /// When name claims are present, you can use them to update your app's user records. Note that this claim is never guaranteed to be present.
    /// </summary>
    public string name { get; set; }

    /// <summary>
    /// The URL of the user's profile picture. Might be provided when:
    /// The request scope included the string "profile"
    /// The ID token is returned from a token refresh
    /// When picture claims are present, you can use them to update your app's user records. Note that this claim is never guaranteed to be present.
    /// </summary>
    public string picture { get; set; }

    public string given_name { get; set; }

    public string family_name { get; set; }

    public string locale { get; set; }

    public string alg { get; set; }

    public string kid { get; set; }
}