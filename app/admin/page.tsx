import { redirect } from 'next/navigation';

export default function AdminRoot() {
  // For now, just redirect to login
  // Later we can check auth status and redirect accordingly
  redirect('/admin/login');
} 