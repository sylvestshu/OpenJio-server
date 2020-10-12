const {createSuperAdmin} = require('./Operations/Admin');
const {createUser, giveBadge} = require('./Operations/User');
const {addAddress} = require('./Operations/Address');
const badgeControl = require('../enum/BadgeControl');

const onInitPopulateDatabase = async () => {
  // Populate admin
  console.log('****[Database] Initializing ****');
  try {
    admin = await createSuperAdmin(
      '1',
      'superadmin',
      'superadmin@openjio.com',
      'password'
    );
    console.log(
      `***[Database] Admin with id ${admin.getDataValue('adminId')} created`
    );
  } catch (error) {
    console.error('***[Database] Unable to insert default super admin:', error);
  }

  // Populating users
  try {
    // First user (John) with COVID-19 & not blacklisted
    const user1 = await createUser('john@email.com', 'password', 'John');

    user1.hasCovid = true;
    user1.isBlackListed = false;
    user1.strikeCount = 1;
    user1.isValidated = true;

    // Add to user address
    const address1 = {
      line1: '181 Stirling Road',
      line2: '#12-34',
      postalCode: '140181',
      country: 'Singapore',
      description: 'My home',
    };

    let assignAddressToUser = await addAddress(user1.userId, address1);
    if (assignAddressToUser) {
      console.log('Address successfully assigned to user: ' + user1.userId);
    }

    user1.save();
    console.log('User created with the name: ' + user1.name);

    // Second user (paul) without COVID-19 & not blacklisted

    user2 = await createUser('paul@email.com', 'password', 'Paul');
    if (user2) {
      user2.hasCovid = false;
      user2.isBlackListed = false;
      user2.strikeCount = 2;
      user2.isValidated = true;
      user2.save();
      console.log('User created with the name: ' + user2.name);
    }

    // Third user (tom) with COVID-19
    user3 = await createUser('tom@email.com', 'password', 'Tom');
    if (user3) {
      user3.hasCovid = true;
      user3.isBlackListed = true;
      user3.strikeCount = 3;
      user3.isValidated = true;
      // Add to user address
      const address3 = {
        line1: '21 Heng Mui Keng Terrace',
        line2: 'Icube Building',
        postalCode: '119613',
        country: 'Singapore',
        description: 'Best place in NUS',
      };

      let assignAddressToUser = await addAddress(user3.userId, address3);
      if (assignAddressToUser) {
        console.log('Address successfully assigned to user: ' + user3.userId);
      }

      user3.save();
      console.log('User created with the name: ' + user3.name);
    }

    // Create 10 users with randomly generated badge counts for leaderboard
    await Promise.all(
      [
        {email: 'jimmy@email.com', name: 'Jimmy'},
        {email: 'denise@email.com', name: 'Denise'},
        {email: 'ashburn@email.com', name: 'Ashburn'},
        {email: 'ace@email.com', name: 'Ace'},
        {email: 'sheryl@email.com', name: 'Sheryl'},
        {email: 'leeming@email.com', name: 'Lee Ming'},
        {email: 'kerry@email.com', name: 'Kerry'},
        {email: 'mae@email.com', name: 'Mae'},
        {email: 'xinyi@email.com', name: 'Xin Yi'},
        {email: 'sharina@email.com', name: 'Sharina'},
      ].map(async (user) => {
        var createdUser = await createUser(user.email, 'password', user.name);
        createdUser.isValidated = true;
        await createdUser.save();
        for (let i = 0; i < Math.floor(Math.random() * 15); i++) {
          await giveBadge(createdUser.userId, badgeControl.types.LOCAL_LOBANG);
        }
      })
    ).then((res) => console.log('**** [Database] Initialization Completed ****'));
  } catch (error) {
    console.error('****[Database] Initialization Failed:', error);
  }
};

module.exports = {
  onInitPopulateDatabase,
};