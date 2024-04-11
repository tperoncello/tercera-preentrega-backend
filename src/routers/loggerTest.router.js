import { Router } from 'express';
import logger from '../logger.js';

const router = Router();

router.get("/", ( req, res ) => {
    logger.debug("Test de Logger debug")
    logger.http("Test de Logger http")
    logger.info("Test de Logger info")
    logger.warning("Test de Logger warning")
    logger.error("Test de Logger error")
    logger.fatal("Test de Logger fatal")
    res.send('ok')
})

export default router