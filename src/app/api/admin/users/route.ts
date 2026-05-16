import { NextResponse } from 'next/server';
2: import { getAllUsers, updateUserRole } from '@/lib/db';
3: import { getSession } from '@/lib/auth';
4: 
5: export async function GET() {
6:   const session = await getSession();
7:   if (!session || session.role !== 'ADMIN') {
8:     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
9:   }
10: 
11:   try {
12:     const users = await getAllUsers();
13:     return NextResponse.json(users);
14:   } catch (error) {
15:     return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
16:   }
17: }
18: 
19: export async function PATCH(request: Request) {
20:   const session = await getSession();
21:   if (!session || session.role !== 'ADMIN') {
22:     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
23:   }
24: 
25:   try {
26:     const { userId, role } = await request.json();
27:     
28:     if (!userId || !role) {
29:       return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
30:     }
31: 
32:     const updatedUser = await updateUserRole(userId, role);
33:     return NextResponse.json(updatedUser);
34:   } catch (error) {
35:     return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
36:   }
37: }
