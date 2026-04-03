export const corsConfig = {
  /*
  |--------------------------------------------------------------------------
  | Access-Control-Allow-Origin
  |--------------------------------------------------------------------------
  |
  | Aquí defines qué dominios externos tienen permiso para consumir tu API.
  | Para seguridad con cookies, nunca uses '*' (wildcard).
  |
  */

  origin: ['http://localhost:3000'],

  /*
  |--------------------------------------------------------------------------
  | Access-Control-Allow-Credentials
  |--------------------------------------------------------------------------
  |
  | Esta opción permite que el navegador acepte y envíe cookies a través
  | de peticiones CORS. Debe estar en 'true' para que el JWT en cookie funcione.
  |
  */

  credentials: true,

  /*
  |--------------------------------------------------------------------------
  | Allowed HTTP Methods
  |--------------------------------------------------------------------------
  */

  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',

  /*
  |--------------------------------------------------------------------------
  | Allowed Headers
  |--------------------------------------------------------------------------
  */

  allowedHeaders: 'Content-Type, Accept, Authorization',
} as const;
