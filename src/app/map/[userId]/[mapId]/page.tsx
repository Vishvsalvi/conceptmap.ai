import React from 'react'
import { auth } from '@/auth';
import Map from '@/components/Map';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getEdgesByMapId, getNodesByMapId, getMap } from '@/app/actions/map';

const Viewmap = async ({ params }: { params: { userId: string, mapId: string } }) => {

  const session = await auth();
  const sessionId = session?.user?.id;
  const {userId, mapId} = params;

  if (userId !== sessionId) {
    console.log('Unauthorized')
    return <UnauthorizedPage />
  }

  const nodes = await getNodesByMapId(mapId);
  const edges = await getEdgesByMapId(mapId);
  const map = await getMap(session?.user?.email, mapId);

  
  return (
    <>
    <Map mapId={mapId} mapname={map?.name} fetchedNodes={nodes} fetchedEdges={edges} />
      
    </>
  )
}

export default Viewmap


function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-50 to-red-100">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-lg rounded-lg text-center">
        <div className="animate-bounce mb-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">
          Oops! It seems you don't have permission to access this page. Please log in or contact the administrator for assistance.
        </p>
        <Link href="/" passHref>
          <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
