(function( $ ) {
    $.fn.tableJS = function(config) {
        
        if(config === undefined){
            config = {};
        }
        
        var $config = config;
        
        var $handler = this;
        
        return new function(){
            
            var $instance = this;
            
            var $defaultConfigs = {
                
            };
            
            var $table = null;
            
            var $response = {
                data: null,
                message: null,
                errors: null,
                success: null
            };
            
            var $callbacks = {};
            
            this.init = function(){
                this.setDefaultConfigs($defaultConfigs);
                
                this.bindEvents();
                
                return this;
            };
            
            this.setDefaultConfigs = function(items){
                $.each(items,function(k,v){
                    if($config[k] === undefined){
                        $config[k] = v;
                    }
                });
            };
            
            this.bindEvents = function(){
                $(document).on('click','.tablejs-event-binder',function(e){
                    e.preventDefault();
                    
                    return $instance['event_' + $(this).attr('data-event')]($(this));
                });
            };
            
            this.getConfig = function(name){
                return ($config[name] !== undefined ? $config[name] : null);
            };
            
            this.setResponse = function(r){
                $response.success = r.success;
                $response.message = r.message;
                $response.errors = r.errors;
                $response.data = r.response;
            };
            
            this.getResponse = function(name){
                return ($response[name] !== undefined ? $response[name] : null);
            };
            
            this.getResponseSuccess = function(){
                return ($response.success ? true : false);
            };
            
            this.getResponseData = function(name){
                return ($response.data[name] !== undefined ? $response.data[name] : null);
            };
            
            this.hasResponseData = function(name){
                return ($response.data[name] !== undefined ? true : false);
            };
            
            this.getResponseErrors = function(){
                return $response.errors;
            };
            
            this.getResponseMessage = function(name){
                return ($response.message[name] !== undefined ? $response.message[name] : null);
            };
            
            /**
             * EVENTS
             */
            this.onInit = function(cb){
                $.each($($handler),function(){
                    cb($instance,$(this));
                });
                
                return this;
            };
            
            this.onSuccess = function(cb){
                $callbacks['onSuccess'] = cb;
                return this;
            };
            
            this.onError = function(cb){
                $callbacks['onError'] = cb;
                return this;
            };
            
            return this.init();
        };
    };
})( jQuery );