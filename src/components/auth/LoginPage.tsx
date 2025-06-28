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
          login(userData); // AuthContext handles redirect
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
      {/* Background Animation */}
      <div className="absolute inset-0">
        {/* animated blur circles */}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Branding */}
          <motion.div className="text-white text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Student & Employee<br />Task Manager
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100">
              Streamline your productivity with intelligent task management,
              powered by AWS cloud technology.
            </p>
          </motion.div>

          {/* Auth Form */}
          <motion.div className="w-full max-w-md mx-auto lg:max-w-lg">
            <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {confirmationStep ? 'Confirm Account' : isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
              </div>

              {/* Demo Buttons */}
              {!confirmationStep && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Demo Accounts:</h3>
                  {demoCredentials.map((demo, i) => (
                    <button
                      key={i}
                      onClick={() => handleDemoLogin(demo)}
                      className="block w-full text-left p-2 rounded-md bg-white shadow-sm hover:shadow-md border"
                    >
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{demo.email}</div>
                        <div className="text-gray-500">{demo.role} • {demo.password}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {confirmationStep ? (
                  <input
                    type="text"
                    required
                    placeholder="Confirmation Code"
                    value={formData.confirmationCode}
                    onChange={(e) => setFormData({ ...formData, confirmationCode: e.target.value })}
                    className="input"
                  />
                ) : (
                  <>
                    {!isLogin && (
                      <>
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Phone (+1234567890)"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="input"
                        />
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                          className="input"
                        >
                          <option value="student">Student</option>
                          <option value="employee">Employee</option>
                        </select>
                      </>
                    )}

                    <input
                      type="email"
                      required
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                    />
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {!isLogin && (
                      <input
                        type="password"
                        required
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="input"
                      />
                    )}
                  </>
                )}

                <Button type="submit" size="lg" loading={loading} className="w-full">
                  {confirmationStep ? 'Confirm Account' : isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              {!confirmationStep && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
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
