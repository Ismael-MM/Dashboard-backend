export const authConfig = {
  /*
  |--------------------------------------------------------------------------
  | Authentication loginMethod
  |--------------------------------------------------------------------------
  |
  | Aquí defines el tipo de metodo de login que usara tu aplicación
  | los metodos son email o username. Cambialo a tu gusto
  | en caso de poner username, debes tener username en la base de datos,
  |
  |
  */

  loginMethod: 'email',

  /*
  |--------------------------------------------------------------------------
  | Cookie SameSite Policy
  |--------------------------------------------------------------------------
  |
  | Define el nivel de restricción para el envío de cookies entre sitios.
  | Esto es tu principal defensa contra ataques CSRF.
  |
  | Valores aceptados: 
  | 'strict': Máxima seguridad. Solo envía la cookie si la petición nace en tu web.
  | 'lax'   : Equilibrio. Envía la cookie al navegar desde enlaces externos (GET).
  | 'none'  : Sin restricciones. (Requiere que la cookie sea 'secure: true').
  |
  */

  cookieSameSite: 'strict',

  /*
  |--------------------------------------------------------------------------
  | Authentication ExpersIn
  |--------------------------------------------------------------------------
  |
  | Aquí defines el tiempo de duracion de la cookie
  | y el tiempo de duracion del JTW
  | formato acceptado: d (Dias), m (minutos), s (segundos)  
  |
  */

  ExpiresIn: '7d',
} as const;
