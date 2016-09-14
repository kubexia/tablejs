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
                loadingText: '<i class="fa fa-spin fa-spinner fa-fw"></i>'
            };
            
            var $table = null;
            
            var $response = {
                data: null,
                message: null,
                errors: null,
                success: null
            };
            
            var $callbacks = {};
            
            var $events = {
                '.table-item-delete': {
                    'type': 'click',
                    'method': 'event_itemDelete'
                },
                
                '.table-modal-open': {
                    'type': 'click',
                    'method': 'event_openModal'
                }
            };
            
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
                
                $.each($events, function(handler, event){
                    $(document).on(event.type,handler,function(e){
                        e.preventDefault();
                        return $instance[event.method]($(this));
                    });
                })
            };
            
            
            this.event_itemDelete = function(object){
                $table = object.closest($handler);
                var returnUrl = (object.data('return-url') !== undefined && object.data('return-url') !== '' ? object.data('return-url') : $table.attr('data-baseurl'));
                
                if(confirm(object.data('message'))){
                    var row = object.closest('td');
                    row.html(this.getConfig('loadingText'));
                    
                    $.ajax({
                        type: "POST",
                        url: object.data('request-url'),
                        dataType: 'json',
                        data: {'_method': 'DELETE'},
                        success: function(data){
                            $instance.setResponse(data);
                            
                            if($instance.getResponseSuccess() === true){
                                if(object.data('callback-success') !== undefined){
                                    var cb = window[object.data('callback-success')];
                                    if (typeof cb === "function"){
                                        return cb($instance,$table,data);
                                    }
                                }
                                else{
                                    if($instance.getResponseData('redirect_to')){
                                        returnUrl = $instance.getResponseData('redirect_to');
                                    }
                                    document.location.href = (returnUrl ? returnUrl : document.location.href);
                                }
                            }
                        },
                        error: function(xhr, textStatus, errorThrown){
                            console.log(xhr.responseText);
                        }
                    });
                }
            };
            
            this.event_openModal = function(object){
                
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
                return ($response.data !== null && $response.data[name] !== undefined ? $response.data[name] : null);
            };
            
            this.hasResponseData = function(name){
                return ($response.data !== null && $response.data[name] !== undefined ? true : false);
            };
            
            this.getResponseErrors = function(){
                return $response.errors;
            };
            
            this.getResponseMessage = function(name){
                return ($response.message !== null && $response.message[name] !== undefined ? $response.message[name] : null);
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