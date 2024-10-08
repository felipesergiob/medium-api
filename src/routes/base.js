import { Router } from 'express';
import SchemaValidator from '../utils/schema-validator';

class BaseRoutes {
	constructor() {
		this.router = Router();
		this.SchemaValidator = SchemaValidator;
	}
}

export default BaseRoutes;
