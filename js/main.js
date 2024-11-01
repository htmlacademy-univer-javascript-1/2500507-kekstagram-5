import './data.js';
import './until.js';
import { generatePhotos } from './data.js';
import {renderingThumbnails} from './pictures.js';
renderingThumbnails(generatePhotos());
