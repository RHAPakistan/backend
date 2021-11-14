const bcrypt = require('bcryptjs');

const data = {
  users: [
    {
      fullName: 'Hassan Anwar',
      email: 'hassan@example.com',
      password: bcrypt.hashSync('1234', 8),
    },
    {
      fullName: 'Jawad Mustafa',
      email: 'jawad@example.com',
      password: bcrypt.hashSync('1234', 8),
    },
  ],
  
};
//export default data;
