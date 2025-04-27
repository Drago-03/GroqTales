import axios from 'axios';

// Pinata API endpoints
const PINATA_BASE_URL = 'https://api.pinata.cloud';
const PINATA_PIN_FILE_ENDPOINT = `${PINATA_BASE_URL}/pinning/pinFileToIPFS`;

// Get Pinata credentials from environment variables
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

/**
 * Uploads a file to IPFS using Pinata
 * @param file The file or data to upload
 * @param metadata Optional metadata for the file
 * @returns The IPFS hash (CID) of the uploaded file
 */
export const uploadToIPFS = async (file: File | string, metadata?: Record<string, any>): Promise<string> => {
  if (!PINATA_API_KEY || !PINATA_API_SECRET) {
    throw new Error('Pinata API credentials are not set in environment variables');
  }

  try {
    const formData = new FormData();
    if (typeof file === 'string') {
      // If string, treat as content to be converted to Blob
      formData.append('file', new Blob([file], { type: 'text/plain' }), 'content.txt');
    } else {
      // If File, append directly
      formData.append('file', file);
    }

    if (metadata) {
      formData.append('pinataMetadata', JSON.stringify(metadata));
    }

    const response = await axios.post(PINATA_PIN_FILE_ENDPOINT, formData, {
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_API_SECRET,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data && response.data.IpfsHash) {
      return response.data.IpfsHash;
    } else {
      throw new Error('Failed to get IPFS hash from Pinata response');
    }
  } catch (error: any) {
    console.error('Error uploading to IPFS via Pinata:', error);
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
};

/**
 * Constructs a gateway URL for accessing IPFS content
 * @param cid The Content Identifier (IPFS hash)
 * @returns A URL to access the content via Pinata gateway
 */
export const getIPFSUrl = (cid: string): string => {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}; 