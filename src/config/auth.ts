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
