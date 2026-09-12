import { create } from 'zustand';

const AUTH_STORAGE_KEY = 'audio_den_auth';
const ADMIN_EMAIL = 'vaibhavgupta1974@gmail.com';
const ADMIN_PASS = 'Admin@123';

const getInitialAuth = () => {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : { user: null, isAdmin: false, isAuthenticated: false };
  } catch {
    return { user: null, isAdmin: false, isAuthenticated: false };
  }
};

const USERS_STORAGE_KEY = 'audio_den_registered_users';

const getRegisteredUsers = () => {
  try {
    const list = localStorage.getItem(USERS_STORAGE_KEY);
    return list ? JSON.parse(list) : [];
  } catch {
    return [];
  }
};

const saveRegisteredUser = (userRecord) => {
  try {
    const list = getRegisteredUsers();
    const existingIndex = list.findIndex(
      (u) => u.email?.toLowerCase() === userRecord.email?.toLowerCase()
    );
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...userRecord };
    } else {
      list.push(userRecord);
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));

    // Also trigger custom event to notify listeners
    window.dispatchEvent(new CustomEvent('audio_den_users_updated', { detail: list }));
  } catch (err) {
    console.error('Failed to save registered user:', err);
  }
};

export const useAuthStore = create((set, get) => ({
  ...getInitialAuth(),

  login: (email, password) => {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if logging in as Admin
    if (cleanEmail === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASS) {
      const stateUpdate = {
        isAuthenticated: true,
        isAdmin: true,
        user: {
          id: 'admin-0',
          name: 'Vaibhav Gupta (Admin)',
          email: ADMIN_EMAIL,
          phone: '9935102727',
          role: 'Administrator',
          addresses: get().user?.addresses || []
        }
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stateUpdate));
      set(stateUpdate);
      return { success: true, isAdmin: true, message: 'Welcome back, Admin!' };
    }

    // Check against registered users
    const registeredList = getRegisteredUsers();
    const foundUser = registeredList.find((u) => u.email?.toLowerCase() === cleanEmail);

    if (foundUser) {
      // If password was stored and doesn't match
      if (foundUser.password && foundUser.password !== password && password.length < 4) {
        return { success: false, message: 'Invalid password. Please check and try again.' };
      }

      const stateUpdate = {
        isAuthenticated: true,
        isAdmin: false,
        user: {
          id: foundUser.id || 'usr-' + Date.now(),
          name: foundUser.name || cleanEmail.split('@')[0],
          email: foundUser.email,
          phone: foundUser.phone || '9935102727',
          role: 'Customer',
          addresses: foundUser.addresses || get().user?.addresses || []
        }
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stateUpdate));
      set(stateUpdate);
      return { success: true, isAdmin: false, message: `Welcome back, ${stateUpdate.user.name}!` };
    }

    // Regular user login simulation for any valid email
    if (cleanEmail.includes('@') && password.length >= 4) {
      const newUser = {
        id: 'usr-' + Date.now(),
        name: cleanEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim().toUpperCase() || 'Customer',
        email: cleanEmail,
        phone: '9935102727',
        role: 'Customer',
        addresses: get().user?.addresses || []
      };
      saveRegisteredUser(newUser);

      const stateUpdate = {
        isAuthenticated: true,
        isAdmin: false,
        user: newUser
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stateUpdate));
      set(stateUpdate);
      return { success: true, isAdmin: false, message: 'Logged in successfully!' };
    }

    return { success: false, message: 'Invalid credentials. Password must be at least 4 characters.' };
  },

  adminLogin: (email, password) => {
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASS) {
      const stateUpdate = {
        isAuthenticated: true,
        isAdmin: true,
        user: {
          id: 'admin-0',
          name: 'Vaibhav Gupta (Administrator)',
          email: ADMIN_EMAIL,
          phone: '9935102727',
          role: 'Administrator'
        }
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stateUpdate));
      set(stateUpdate);
      return { success: true, message: 'Admin authentication successful!' };
    }
    return { success: false, message: 'Invalid Admin credentials' };
  },

  register: (nameOrObj, email, phoneOrPass, passwordMaybe) => {
    let name, userEmail, phone, password;

    if (typeof nameOrObj === 'object') {
      name = nameOrObj.name;
      userEmail = nameOrObj.email;
      phone = nameOrObj.phone;
      password = nameOrObj.password;
    } else {
      name = nameOrObj;
      userEmail = email;
      // Handle argument order ambiguity: (name, email, phone, password) OR (name, email, password, phone)
      if (typeof phoneOrPass === 'string' && phoneOrPass.includes('@')) {
        password = phoneOrPass;
        phone = passwordMaybe;
      } else if (passwordMaybe && passwordMaybe.length >= 4) {
        phone = phoneOrPass;
        password = passwordMaybe;
      } else {
        password = phoneOrPass;
        phone = passwordMaybe || '9935102727';
      }
    }

    if (!userEmail) {
      return { success: false, message: 'Email address is required.' };
    }

    const cleanEmail = userEmail.trim().toLowerCase();

    const newUser = {
      id: 'usr-' + Date.now(),
      name: name?.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: phone?.trim() || '9935102727',
      password: password || '123456',
      role: 'Customer',
      joinedDate: new Date().toISOString().split('T')[0],
      addresses: []
    };

    saveRegisteredUser(newUser);

    const stateUpdate = {
      isAuthenticated: true,
      isAdmin: false,
      user: newUser
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stateUpdate));
    set(stateUpdate);
    return { success: true, message: 'Registration successful! Welcome to Audio Den.' };
  },

  // One-click demo customer login for quick checkout testing
  loginAsDemoCustomer: () => {
    const demoUser = {
      id: 'cust-demo-1',
      name: 'Rohit Verma',
      email: 'rohit.verma26@gmail.com',
      phone: '9839123456',
      role: 'Customer',
      addresses: [
        {
          id: 'addr-1',
          name: 'Rohit Verma',
          phone: '9839123456',
          address: '18/4 Civil Lines, Near Subhash Chauraha',
          landmark: 'Opposite High Court',
          city: 'Prayagraj',
          state: 'Uttar Pradesh',
          pincode: '211001',
          isDefault: true
        }
      ]
    };
    saveRegisteredUser(demoUser);
    const stateUpdate = {
      isAuthenticated: true,
      isAdmin: false,
      user: demoUser
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stateUpdate));
    set(stateUpdate);
    return { success: true, message: 'Signed in as Rohit Verma (Demo Customer)' };
  },

  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    set({ user: null, isAdmin: false, isAuthenticated: false });
  },

  updateProfile: (updatedData) => {
    set((state) => {
      const updatedUser = { ...state.user, ...updatedData };
      const nextState = { ...state, user: updatedUser };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
      return nextState;
    });
  },

  addAddress: (address) => {
    set((state) => {
      const currentAddresses = state.user?.addresses || [];
      const newAddress = {
        id: 'addr-' + Date.now(),
        ...address,
        isDefault: currentAddresses.length === 0
      };
      const updatedUser = {
        ...state.user,
        addresses: [...currentAddresses, newAddress]
      };
      const nextState = { ...state, user: updatedUser };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
      return nextState;
    });
  },

  removeAddress: (addressId) => {
    set((state) => {
      const updatedUser = {
        ...state.user,
        addresses: (state.user?.addresses || []).filter((a) => a.id !== addressId)
      };
      const nextState = { ...state, user: updatedUser };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
      return nextState;
    });
  }
}));
