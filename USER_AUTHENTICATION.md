# USER AUTHENTICATION SPECIFICATION

| Provider | Method | Token Handling | Admin Exposure |
| :--- | :--- | :--- | :--- |
| **Username + Password** | Bcrypt Hash | JWT Bearer Token | Masked / Zero Exposure |
| **Google OAuth** | OAuth 2.0 Token | Google IdToken Verification | Provider ID Only |
