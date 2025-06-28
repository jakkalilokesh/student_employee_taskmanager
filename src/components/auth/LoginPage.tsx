import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    role: 'student' as 'student' | 'employee',
    confirmationCode: '',
  });

  const { login } = useAuth();

  const demoCredentials = [
    { email: 'student@demo.com', password: 'Demo123!', role: 'Student' },
    { email: 'employee@demo.com', password: 'Demo123!', role: 'Employee' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (confirmationStep) {
        await confirmSignUp({
          username: formData.email,
          confirmationCode: formData.confirmationCode,
        });
        toast.success('Account confirmed successfully!');
        setConfirmationStep(false);
        setIsLogin(true);
      } else if (isLogin) {
        const { isSignedIn } = await signIn({
          username: formData.email,
          password: formData.password,
        });
        
        if (isSignedIn) {
          const userData = {
            id: Date.now().toString(),
            email: formData.email,
            name: formData.name || formData.email.split('@')[0],
            role: formData.role,
            createdAt: new Date().toISOString(),
            preferences: {
              theme: 'light' as const,
              notifications: {
                email: true,
                sms: true,
                push: true,
              },
            },
          };
          login(userData);
          toast.success('Welcome back!');
        }
      } else {
        await signUp({
          username: formData.email,
          password: formData.password,
          options: {
            userAttributes: {
              email: formData.email,
              name: formData.name,
              phone_number: formData.phone,
            },
          },
        });
        toast.success('Account created! Please check your email for confirmation code.');
        setConfirmationStep(true);
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demo: typeof demoCredentials[0]) => {
    setFormData(prev => ({
      ...prev,
      email: demo.email,
      password: demo.password,
      role: demo.role.toLowerCase() as 'student' | 'employee',
    }));
    
    // Simulate demo login
    const userData = {
      id: Date.now().toString(),
      email: demo.email,
      name: `Demo ${demo.role}`,
      role: demo.role.toLowerCase() as 'student' | 'employee',
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'light' as const,
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
      },
    };
    login(userData);
    toast.success(`Welcome, Demo ${demo.role}!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-center lg:text-left"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Student & Employee
              <br />
              Task Manager
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100">
              Streamline your productivity with intelligent task management,
              powered by AWS cloud technology.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-blue-200">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Real-time Sync</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Smart Notifications</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Secure Cloud Storage</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto lg:max-w-lg"
          >
            <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {confirmationStep ? 'Confirm Account' : isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-600">
                  {confirmationStep 
                    ? 'Enter the confirmation code sent to your email'
                    : isLogin 
                      ? 'Sign in to your account to continue'
                      : 'Join thousands of productive users'
                  }
                </p>
              </div>

              {/* Demo Credentials */}
              {!confirmationStep && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Demo Accounts:</h3>
                  <div className="space-y-2">
                    {demoCredentials.map((demo, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDemoLogin(demo)}
                        className="w-full text-left p-2 rounded-md bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300"
                      >
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{demo.email}</div>
                          <div className="text-gray-500">{demo.role} • {demo.password}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {confirmationStep ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Confirmation Code"
                      value={formData.confirmationCode}
                      onChange={(e) => setFormData({ ...formData, confirmationCode: e.target.value })}
                    />
                  </div>
                ) : (
                  <>
                    {!isLogin && (
                      <>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Phone Number (+1234567890)"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>

                        <div className="relative">
                          <select
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'student' | 'employee' })}
                          >
                            <option value="student">Student</option>
                            <option value="employee">Employee</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>

                    {!isLogin && (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                      </div>
                    )}
                  </>
                )}

                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  {confirmationStep ? 'Confirm Account' : isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              {!confirmationStep && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};