import ShowroomView from '@/components/ShowroomView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ShowroomPage() {
  return (
    <div className="md:pl-12">
        <ShowroomView />
    </div>
  );
}
